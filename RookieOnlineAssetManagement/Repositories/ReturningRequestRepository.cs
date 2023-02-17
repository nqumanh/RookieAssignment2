using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Enum;
using RookieOnlineAssetManagement.Interface;
using RookieOnlineAssetManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Repositories
{
    public class ReturningRequestRepository : IReturningRequestRepository
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;

        public ReturningRequestRepository(IMapper mapper, ApplicationDbContext context)
        {
            _mapper = mapper;
            _context = context;
        }


        public async Task<ReturningRequestPagingModel> GetReturningRequestsAsync(ReturningRequestParameters parameters, string location)
        {
            var searchString = (parameters.SearchString == null) ? "" : parameters.SearchString;
            var ReturningRequestQuery = _context.ReturningRequests
                .Include(_ => _.Assignment)
                .ThenInclude(_ => _.Asset)
                .Include(_ => _.RequestedBy)
                .Include(_ => _.AcceptedBy)
                .Where(x => x.IsDisabled == false &&
                    (x.Assignment.Asset.AssetCode.Contains(searchString) ||
                    x.Assignment.Asset.AssetName.Contains(searchString) ||
                    x.RequestedBy.UserName.Contains(searchString))
                    && x.Assignment.Asset.Location == location
                );

            if (parameters.ReturnedDate != DateTime.MinValue)
            {
                ReturningRequestQuery = ReturningRequestQuery
                    .Where(x =>
                        x.ReturnedDate.Value.Date == parameters.ReturnedDate.Date &&
                        x.ReturnedDate.Value.Month == parameters.ReturnedDate.Month &&
                        x.ReturnedDate.Value.Year == parameters.ReturnedDate.Year
                    );
            }

            if (parameters.FilterState > 0)
                ReturningRequestQuery = ReturningRequestQuery.Where(x => x.State == (ReturningRequestState)parameters.FilterState);

            var ReturningRequestCount = ReturningRequestQuery.Count();

            if (parameters.SortType)
            {
                switch (parameters.SortBy)
                {
                    case "Asset Code":
                        ReturningRequestQuery = ReturningRequestQuery.OrderBy(on => on.Assignment.Asset.AssetCode);
                        break;
                    case "Asset Name":
                        ReturningRequestQuery = ReturningRequestQuery.OrderBy(on => on.Assignment.Asset.AssetName);
                        break;
                    case "Requested by":
                        ReturningRequestQuery = ReturningRequestQuery.OrderBy(on => on.RequestedBy.UserName);
                        break;
                    case "Accepted by":
                        ReturningRequestQuery = ReturningRequestQuery.OrderBy(on => on.AcceptedBy.UserName);
                        break;
                    case "Returned Date":
                        ReturningRequestQuery = ReturningRequestQuery.OrderBy(on => on.ReturnedDate);
                        break;
                    case "State":
                        ReturningRequestQuery = ReturningRequestQuery.OrderBy(on => on.State);
                        break;
                    default:
                        break;
                }
            }
            else
            {
                switch (parameters.SortBy)
                {
                    case "Asset Code":
                        ReturningRequestQuery = ReturningRequestQuery.OrderByDescending(on => on.Assignment.Asset.AssetCode);
                        break;
                    case "Asset Name":
                        ReturningRequestQuery = ReturningRequestQuery.OrderByDescending(on => on.Assignment.Asset.AssetName);
                        break;
                    case "Requested by":
                        ReturningRequestQuery = ReturningRequestQuery.OrderByDescending(on => on.RequestedBy.UserName);
                        break;
                    case "Accepted by":
                        ReturningRequestQuery = ReturningRequestQuery.OrderByDescending(on => on.AcceptedBy.UserName);
                        break;
                    case "Returned Date":
                        ReturningRequestQuery = ReturningRequestQuery.OrderByDescending(on => on.ReturnedDate);
                        break;
                    case "State":
                        ReturningRequestQuery = ReturningRequestQuery.OrderByDescending(on => on.State);
                        break;
                    default:
                        break;
                }
            }

            var ReturningRequests = await ReturningRequestQuery
                .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                .Take(parameters.PageSize)
                .ToListAsync();

            var ReturningRequestList = _mapper.Map<List<ReturningRequestDTO>>(ReturningRequests);

            return new ReturningRequestPagingModel
            {
                TotalItem = ReturningRequestCount,
                ReturningRequests = ReturningRequestList,
            };
        }

        public async Task<ReturningRequestCreateModel> CreateReturningRequest(int assignmentId, User userLogin)
        {
            var assignment = await _context.Assignments.Where(p => p.Id == assignmentId && p.IsDisabled == false && p.State == AssignmentState.Accepted).FirstOrDefaultAsync();
            if (assignment != null)
            {
                var returningRequest = new ReturningRequest
                {
                    State = ReturningRequestState.WaitingForReturning,
                    RequestedBy = userLogin,
                    Assignment = assignment,
                    IsDisabled = false,
                };
                await _context.ReturningRequests.AddAsync(returningRequest);
                await _context.SaveChangesAsync();
                var req = _mapper.Map<ReturningRequestCreateModel>(returningRequest);
                return req;
            }
            return null;
        }
        public async Task<ReturningRequestDTO> CompleteReturningRequest(int id, User currentUser)
        {
            ReturningRequest returningRequest = await _context.ReturningRequests.FirstOrDefaultAsync(x => x.Id == id);
            if (returningRequest != null)
            {
                var assignment = await _context.Assignments.Include(a => a.Asset).FirstOrDefaultAsync(x => x.ReturningRequests.Any(x => x.Id == returningRequest.Id));
                if (assignment != null)
                {
                    assignment.IsDisabled = true;
                    if (assignment.Asset != null)
                    {
                        assignment.Asset.State = AssetState.Available;
                    }
                }
                returningRequest.AcceptedBy = currentUser;
                returningRequest.State = ReturningRequestState.Completed;
                returningRequest.ReturnedDate = DateTime.Now;
                await _context.SaveChangesAsync();
            }
            var returningRequestDto = _mapper.Map<ReturningRequestDTO>(returningRequest);
            return returningRequestDto;

        }

        public async Task<bool> DisabledReturningRequestById(int requestId)
        {
            var returningRequest = await _context.ReturningRequests.FindAsync(requestId);

            if (returningRequest != null)
            {
                returningRequest.IsDisabled = true;
                returningRequest.State = ReturningRequestState.Completed;
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }
    }
}