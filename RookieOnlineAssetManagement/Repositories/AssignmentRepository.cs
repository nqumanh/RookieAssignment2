using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Enum;
using RookieOnlineAssetManagement.Interface;
using RookieOnlineAssetManagement.Models;
using RookieOnlineAssetManagement.Models.Assignment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Repositories;

public class AssignmentRepository : IAssignmentRepository, IDisposable
{
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;

    public AssignmentRepository(IMapper mapper, ApplicationDbContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public AssignmentPagingModel GetAssignmentListOfUserById(string userId, string fieldName, string sortType, int page, int limit)
    {
        // Query data
        var query = _context.Assignments
                    .Include(m => m.Asset)
                    .Include(m => m.Asset.Category)
                    .Include(m=>m.ReturningRequests)
                    .Where(m => m.AssignedTo == userId &&
                                m.IsDisabled == false &&
                                m.AssignedDate.Date <= DateTime.Today);

        // Sort
        if (!string.IsNullOrEmpty(fieldName))
        {
            if (sortType == "asc")
            {
                switch (fieldName)
                {
                    case "assetCode":
                        query = query.OrderBy(m => m.Asset.AssetCode);
                        break;
                    case "assetName":
                        query = query.OrderBy(m => m.Asset.AssetName);
                        break;
                    case "category":
                        query = query.OrderBy(m => m.Asset.Category.Name);
                        break;
                    case "assignedDate":
                        query = query.OrderBy(m => m.AssignedDate);
                        break;
                    case "state":
                        query = query.OrderBy(m => m.State);
                        break;
                }
            }
            else if (sortType == "desc")
            {
                switch (fieldName)
                {
                    case "assetCode":
                        query = query.OrderByDescending(m => m.Asset.AssetCode);
                        break;
                    case "assetName":
                        query = query.OrderByDescending(m => m.Asset.AssetName);
                        break;
                    case "category":
                        query = query.OrderByDescending(m => m.Asset.Category.Name);
                        break;
                    case "assignedDate":
                        query = query.OrderByDescending(m => m.AssignedDate);
                        break;
                    case "state":
                        query = query.OrderByDescending(m => m.State);
                        break;
                }
            }
        }

        // Paging
        var total = query.Count();

        query = query.Skip((page - 1) * limit).Take(limit);
        var assignmentDTO = _mapper.Map<List<AssignmentViewDTO>>(query.ToList());

        return new AssignmentPagingModel
        {
            Assignments = assignmentDTO,
            TotalItem = total,
            Page = page,
            LastPage = (int)Math.Ceiling(Decimal.Divide(total, limit))
        };
    }
    public async Task<AssignmentDetailDTO> GetAssignmentById(int assignmentId)
    {
        var assignment = await _context.Assignments
            .Where(m => m.Id == assignmentId)
            .Include(m => m.Asset)
            .Include(m => m.AssignedToUser)
            .Include(m => m.AssignedByUser)
            .Include(m => m.Asset.Category)
            .FirstOrDefaultAsync();

        var assignmentDTO = _mapper.Map<AssignmentDetailDTO>(assignment);
        return assignmentDTO;
    }

    public async Task<Assignment> AcceptAssignmentById(int assignmentId)
    {
        var assignment = await _context.Assignments
            .Include(m => m.Asset)
            .FirstOrDefaultAsync(x => x.Id == assignmentId);

        if (assignment != null)
        {
            assignment.State = AssignmentState.Accepted;
            assignment.Asset.State = AssetState.Assigned;
            await _context.SaveChangesAsync();
        }
        return assignment;
    }
    public async Task<Assignment> DisabledAssignmentById(int assignmentId)
    {
        var assignment = await _context.Assignments.Include(p => p.Asset).Where(p => p.Id == assignmentId && p.State == AssignmentState.WaitingForAcceptance).FirstOrDefaultAsync();

        if (assignment != null)
        {
            assignment.Asset.State = AssetState.Available;
            assignment.IsDisabled = true;
            await _context.SaveChangesAsync();
        }
        return assignment;
    }

    public async Task<AssignmentDTO> GetAsync(int id)
    {
        var assignment = await _context.Assignments
            .Include(x => x.Asset)
            .Include(x => x.AssignedByUser)
            .Include(x => x.AssignedToUser)
            .FirstOrDefaultAsync(x => x.Id == id);
        return _mapper.Map<AssignmentDTO>(assignment);
    }
    public async Task<AssignmentDTO> CreateAssignmentAsync(User assignor, CreateAssignmentModel assignment)
    {
        var assignee = await _context.Users.FirstOrDefaultAsync(x => x.StaffCode == assignment.StaffCode);
        var asset = await _context.Assets.FirstOrDefaultAsync(x => x.AssetCode == assignment.AssetCode);
        var newAssignment = new Assignment
        {
            AssignedByUser = assignor,
            AssignedToUser = assignee,
            Asset = asset,
            AssignedDate = assignment.AssignedDate,
            State = AssignmentState.WaitingForAcceptance,
            Note = assignment.Note,
        };
        newAssignment.Asset.State = AssetState.Assigned;
        await _context.Assignments.AddAsync(newAssignment);
        await _context.SaveChangesAsync();
        var assignmentDTO = _mapper.Map<AssignmentDTO>(newAssignment);
        return assignmentDTO;
    }

    public async Task<AssignmentDetailEditDTO> GetAssignmentEditById(int assignmentId)
    {
        var assignment = await _context.Assignments
            .Where(m => m.Id == assignmentId)
            .Include(m => m.Asset)
            .Include(m => m.AssignedToUser)
            .Include(m => m.AssignedByUser)
            .Select(m => new AssignmentDetailEditDTO
            {
                Id = assignmentId,
                AssetCode = m.Asset.AssetCode,
                AssetName = m.Asset.AssetName,
                StaffCode = m.AssignedToUser.StaffCode,
                AssignedTo = m.AssignedToUser.UserName,
                AssignedBy = m.AssignedByUser.UserName,
                Fullname = m.AssignedToUser.FirstName + " " + m.AssignedToUser.LastName,
                AssignedDate = m.AssignedDate,
                State = m.State,
                Note = m.Note,
                Specification = m.Asset.Specification,
            }).FirstOrDefaultAsync();
        return assignment;
    }
    public async Task<AssignmentDTO> EditAssignmentAsync(int idAssignment, EditAssignmentModel assignment)
    {
        var assignee = await _context.Users.FirstOrDefaultAsync(x => x.StaffCode == assignment.StaffCode);
        var asset = await _context.Assets.FirstOrDefaultAsync(x => x.AssetCode == assignment.AssetCode);
        var assignmentOld = await _context.Assignments.Where(p => p.Id == idAssignment && p.State == AssignmentState.WaitingForAcceptance).Include(p => p.Asset).FirstOrDefaultAsync();
        if (assignmentOld != null)
        {
            assignmentOld.AssignedToUser = assignee;
            assignmentOld.Asset = asset;
            assignmentOld.AssignedDate = assignment.AssignedDate;
            assignmentOld.Note = assignment.Note;

            _context.Assignments.Update(assignmentOld);
            await _context.SaveChangesAsync();

            var assignmentDTO = _mapper.Map<AssignmentDTO>(assignmentOld);
            return assignmentDTO;
        }
        return null;
    }

    private bool disposed = false;

    protected virtual void Dispose(bool disposing)
    {
        if (!this.disposed)
        {
            if (disposing)
            {
                _context.Dispose();
            }
        }
        this.disposed = true;
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    public async Task<List<AssignmentGetDTO>> GetAssignmentsByFiltersAsync(int pageNumber, int pageSize, AssignmentFilters filters, User currentUser)
    {
        var assignmentQuery = _context.Assignments
            .Include(a => a.Asset)
            .Include(a => a.ReturningRequests)
            .Include(a => a.AssignedToUser)
            .Include(a => a.AssignedByUser)
            .Where(assignment => assignment.IsDisabled == false
                && (filters.State == "All" || assignment.State == (filters.State == "Accepted" ? Enum.AssignmentState.Accepted : Enum.AssignmentState.WaitingForAcceptance))
                && (filters.AssignedDate == null || assignment.AssignedDate.Date == filters.AssignedDate.Value.Date)
                && (assignment.Asset.Location == currentUser.Location)
                && (assignment.Asset.AssetCode.Contains(filters.SearchWords.ToUpper())
                    || assignment.Asset.AssetName.ToUpper().Contains(filters.SearchWords.ToUpper())
                    || assignment.AssignedToUser.UserName.ToUpper().Contains(filters.SearchWords.ToUpper()))
                );

        if (filters.SortType == "asc")
        {
            assignmentQuery = filters.SortBy switch
            {
                "AssetCode" => assignmentQuery.OrderBy(a => a.Asset.AssetCode),
                "AssetName" => assignmentQuery.OrderBy(a => a.Asset.AssetName.ToUpper().Trim()),
                "AssignedTo" => assignmentQuery.OrderBy(a => a.AssignedToUser.UserName),
                "AssignedBy" => assignmentQuery.OrderBy(a => a.AssignedByUser.UserName),
                "AssignedDate" => assignmentQuery.OrderBy(a => a.AssignedDate),
                "State" => assignmentQuery.OrderBy(a => a.State),
                _ => assignmentQuery.OrderBy(a => a.Id),
            };
        }
        if (filters.SortType == "desc")
        {
            assignmentQuery = filters.SortBy switch
            {
                "AssetCode" => assignmentQuery.OrderByDescending(a => a.Asset.AssetCode),
                "AssetName" => assignmentQuery.OrderByDescending(a => a.Asset.AssetName.ToUpper().Trim()),
                "AssignedTo" => assignmentQuery.OrderByDescending(a => a.AssignedToUser.UserName),
                "AssignedBy" => assignmentQuery.OrderByDescending(a => a.AssignedByUser.UserName),
                "AssignedDate" => assignmentQuery.OrderByDescending(a => a.AssignedDate),
                "State" => assignmentQuery.OrderByDescending(a => a.State),
                _ => assignmentQuery.OrderByDescending(a => a.Id),
            };
        }

        var sortedAssignmentList = await assignmentQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        var assignmentDTOList = _mapper.Map<List<AssignmentGetDTO>>(sortedAssignmentList);
        return assignmentDTOList;
    }

    public async Task<int> CountAssignmentsAfterFilterAsync(AssignmentFilters filters, User currentUser)
    {
        var assignmentsNumber = await _context.Assignments
            .Include(a => a.Asset)
            .Include(a => a.AssignedToUser)
            .Include(a => a.AssignedByUser)
            .Where(assignment => assignment.IsDisabled == false
                && (filters.State == "All" || assignment.State == (filters.State == "Accepted" ? Enum.AssignmentState.Accepted : Enum.AssignmentState.WaitingForAcceptance))
                && (filters.AssignedDate == null || assignment.AssignedDate.Date == filters.AssignedDate.Value.Date)
                && (assignment.Asset.Location == currentUser.Location)
                && (assignment.Asset.AssetCode.Contains(filters.SearchWords.ToUpper())
                    || assignment.Asset.AssetName.ToUpper().Contains(filters.SearchWords.ToUpper())
                    || assignment.AssignedToUser.UserName.ToUpper().Contains(filters.SearchWords.ToUpper()))
            ).CountAsync();
        return assignmentsNumber;
    }
}
