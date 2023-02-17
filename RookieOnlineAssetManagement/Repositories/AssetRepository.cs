using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Enum;
//using NuGet.ContentModel;
using RookieOnlineAssetManagement.Helpper;
using RookieOnlineAssetManagement.Interface;
using RookieOnlineAssetManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Asset = RookieOnlineAssetManagement.Entities.Asset;

namespace RookieOnlineAssetManagement.Repositories;
public class AssetRepository : IAssetRepository
{
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    public AssetRepository(IMapper mapper, ApplicationDbContext context, UserManager<User> userManager)
    {
        _userManager = userManager;
        _mapper = mapper;
        _context = context;
    }

    public async Task<AssetPagingModel> GetAssetsAsync(SearchParameters parameters)
    {
        var assetCount = _context.Assets.Count();
        var assets = await _context.Assets
            .Include(_ => _.Category)
            .OrderBy(on => on.AssetCode)
            .Skip((parameters.PageNumber - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .ToListAsync();

        var assetList = _mapper.Map<List<AssetDTO>>(assets);

        return new AssetPagingModel
        {
            Total = assetCount,
            Assets = assetList,
        };
    }

    public async Task<AssetPagingModel> GetAvailableAssetsAsync(SearchParameters parameters, string location)
    {
        var searchString = (parameters.SearchString == null) ? "" : parameters.SearchString;
        var assetQuery = _context.Assets
            .Include(_ => _.Category)
            .Where(x => x.State == AssetState.Available && x.IsDisabled == false && x.Location == location &&
                (x.AssetCode.Contains(searchString) || x.AssetName.Contains(searchString))
            );
        var assetCount = assetQuery.Count();
        if (parameters.SortType)
        {
            switch (parameters.SortBy)
            {
                case "AssetName":
                    assetQuery = assetQuery.OrderBy(on => (on.AssetName).ToLower());
                    break;
                case "Category":
                    assetQuery = assetQuery.OrderBy(on => on.Category.Name);
                    break;
                default:
                    assetQuery = assetQuery.OrderBy(on => on.AssetCode);
                    break;
            }
        }
        else
        {
            switch (parameters.SortBy)
            {
                case "AssetName":
                    assetQuery = assetQuery.OrderByDescending(on => (on.AssetName).ToLower());
                    break;
                case "Category":
                    assetQuery = assetQuery.OrderByDescending(on => on.Category.Name);
                    break;
                default:
                    assetQuery = assetQuery.OrderByDescending(on => on.AssetCode);
                    break;
            }
        }
        var assets = await assetQuery
            .Skip((parameters.PageNumber - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .ToListAsync();

        var assetList = _mapper.Map<List<AssetDTO>>(assets);

        return new AssetPagingModel
        {
            Total = assetCount,
            Assets = assetList,
        };
    }

    public async Task<AssetDto> AssetCreateAsync(AssetCreateDTO assetCreateDTO, User user)
    {
        Category category = await _context.Categories.FindAsync(assetCreateDTO.CategoryId);
        if (category == null)
        {
            return null;
        }
        if (assetCreateDTO.AssetName.Length == 1)
        {
            assetCreateDTO.AssetName = assetCreateDTO.AssetName.Trim();
        }
        else
        {
            assetCreateDTO.AssetName = Utilities.OptimizeSpace(assetCreateDTO.AssetName);
        }



        Asset asset = _mapper.Map<Asset>(assetCreateDTO);

        int countAsset = await _context.Assets.Where(a => a.AssetCode.StartsWith(category.Prefix)).CountAsync();
        asset.AssetCode = category.Prefix + (countAsset + 1).ToString().PadLeft(6, '0');
        asset.Category = category;
        asset.Location = user.Location;

        await _context.Assets.AddAsync(asset);
        await _context.SaveChangesAsync();
        var AssetDto = _mapper.Map<AssetDto>(asset);
        return AssetDto;
    }
    public async Task<AssetPagingViewModel> GetListAsset(int page, User userLogin, string filterByState, string filterByCategory, string searchString, string sort, string sortBy)
    {
        var assignmentQuery = _context.Assignments.Include(a => a.Asset).Where(a => a.AssignedBy == userLogin.Id && a.IsDisabled == false);
        var assetQuery = _context.Assets.Where(x => x.Location == userLogin.Location && x.IsDisabled == false).Select(x => new AssetModel
        {
            AssetCode = x.AssetCode,
            AssetName = x.AssetName,
            State = x.State,
            InstalledDate = x.InstalledDate,
            Specification = x.Specification,
            Location = userLogin.Location,
            CategoryName = x.Category.Name
        }).OrderBy(x => x.AssetCode);
        if (assignmentQuery.Count() > 0)
        {
            assetQuery = assetQuery.Where(x => (assignmentQuery.Where(a => a.Asset.AssetCode == x.AssetCode).Count() > 0 && x.State == AssetState.Assigned)
            || (assignmentQuery.Where(a => a.Asset.AssetCode != x.AssetCode).Count() > 0 && x.State != AssetState.Assigned)).OrderBy(x => x.AssetCode);
        }
        else
        {
            assetQuery = assetQuery.Where(x => x.State != AssetState.Assigned).OrderBy(x => x.AssetCode);
        }
        if (filterByCategory != "null")
        {
            string[] listCategory = filterByCategory.Trim().Split(' ');
            foreach (var category in listCategory)
            {
                if (category == "All")
                {
                    assetQuery = assetQuery.Where(x => x.CategoryName != "All").OrderBy(x => x.AssetCode);
                    break;
                }

                assetQuery = assetQuery.Where(on => listCategory.Contains(on.CategoryName.Replace(" ", ""))).OrderBy(x => x.AssetCode);
            }
        }
        if (searchString != "null")
        {
            assetQuery = assetQuery.Where(x =>
            (x.AssetCode.Replace(" ", "")
            .ToUpper()
            .Contains(searchString.Replace(" ", "").ToUpper())) ||
            (x.AssetName.Replace(" ", "")
            .ToUpper()
            .Contains(searchString.Replace(" ", "").ToUpper()))).OrderBy(x => x.AssetCode);
        }
        if (filterByState != "null")
        {
            List<AssetState> states = new List<AssetState>();
            string[] listState = filterByState.Trim().Split(' ');
            foreach (var state in listState)
            {
                if (state == "All")
                {
                    assetQuery = assetQuery.Where(x => x.State == AssetState.Assigned ||
                    x.State == AssetState.Available || x.State == AssetState.NotAvailable ||
                    x.State == AssetState.WaitingForRecycling || x.State == AssetState.Recycled).OrderBy(x => x.AssetCode);
                    break;
                }
                AssetState newState = (AssetState)System.Enum.Parse(typeof(AssetState), state);
                states.Add(newState);
            }
            if (filterByState.Contains("All") == false)
            {
                assetQuery = assetQuery.Where(x => states.Contains(x.State)).OrderBy(x => x.AssetCode);
            }
        }
        if (sortBy == "Ascending")
            switch (sort)
            {
                case "Asset Code":
                    assetQuery = assetQuery.OrderBy(x => x.AssetCode);
                    break;
                case "Asset Name":
                    assetQuery = assetQuery.OrderBy(x => x.AssetName);
                    break;
                case "Category":
                    assetQuery = assetQuery.OrderBy(x => x.CategoryName);
                    break;
                case "State":
                    assetQuery = assetQuery.OrderBy(x => x.State);
                    break;
            }
        else
        {
            switch (sort)
            {
                case "Asset Code":
                    assetQuery = assetQuery.OrderByDescending(x => x.AssetCode);
                    break;
                case "Asset Name":
                    assetQuery = assetQuery.OrderByDescending(x => x.AssetName);
                    break;
                case "Category":
                    assetQuery = assetQuery.OrderByDescending(x => x.CategoryName);
                    break;
                case "State":
                    assetQuery = assetQuery.OrderByDescending(x => x.State);
                    break;
            }
        }
        int limit = 10;
        var assetTotal = assetQuery.Count();
        if (page > 0)
        {
            page--;
        };
        if (assetTotal < limit)
        {
            page = 0;
            limit = assetTotal;
        }
        var assetList = await assetQuery.Skip(page * limit).Take(limit).ToListAsync();
        return new AssetPagingViewModel
        {
            AssetTotal = assetTotal,
            AssetList = assetList,

        };
    }

    public async Task<List<AssetHistoryModel>> GetListHistoryOfAsset(string assetCode)
    {
        var assignmentQuery = _context.Assignments.Include(a => a.Asset).Where(a => a.Asset.AssetCode == assetCode).Select(a => new AssignmentHistoryDTO
        {
            AssignedDate = a.AssignedDate,
            AssignedBy = a.AssignedByUser.UserName,
            AssignedTo = a.AssignedToUser.UserName
        });
        var returningRequests = _context.ReturningRequests.Include(r => r.Assignment).ThenInclude(a => a.Asset).Where(r => r.Assignment.Asset.AssetCode == assetCode && r.IsDisabled==false && r.State==ReturningRequestState.Completed).Select(r => new ReturningRequestHistoryModel
        {
            ReturnedDate = r.ReturnedDate
        });
        var assets = _context.Assets.Where(a => a.AssetCode == assetCode).Select(a => new AssetHistoryModel
        {
            ReturningRequestHistory = returningRequests.ToList(),
            AssignmentHistory = assignmentQuery.ToList()
        });
        return await assets.ToListAsync();
    }
    public async Task<AssetDTO> GetAsset(string assetCode)
    {
        var asset = await _context.Assets.Include(_ => _.Category).Where(p => p.AssetCode == assetCode).FirstOrDefaultAsync();
        var assetDto = _mapper.Map<AssetDTO>(asset);
        return assetDto;
    }

    public async Task<AssetEditDTO> UpdateAssetAsync(AssetEditDTO assetEditDTO)
    {
        var asset = await _context.Assets.FirstOrDefaultAsync(u => u.AssetCode == assetEditDTO.AssetCode);
        if (asset != null)
        {
            asset.AssetName = assetEditDTO.AssetName;
            asset.Specification = assetEditDTO.Specification;
            asset.InstalledDate = assetEditDTO.InstalledDate;
            asset.State = assetEditDTO.State;
            _context.Assets.Update(asset);
            await _context.SaveChangesAsync();
            return assetEditDTO;
        }
        else
        {
            return null;
        }
    }
    public async Task<int> CheckAssetCanDeleteAsync(string assetCode)
    {
        var asset = await _context.Assets.Where(u => u.AssetCode == assetCode)
            .Include(a => a.Assignments)
            .FirstOrDefaultAsync();
        var countAssignment = asset.Assignments.Count();
        return countAssignment;
    }
    public async Task<Asset> DeleteAssetAsync(string assetCode)
    {
        Asset asset = _context.Assets.Where(s => s.AssetCode == assetCode).FirstOrDefault();

        if (asset != null)
        {
            asset.IsDisabled = true;
            await _context.SaveChangesAsync();
        }

        return asset;
    }
    public async Task<ReportPagingModel> GetReport(string fieldName, string sortType, int page, int limit, User currentUser)
    {
        int count = await _context.Categories.CountAsync();
        if (page > 0) page--;
        if (limit > count) page = 0;
        var reports = _context.Categories.Include(c => c.Assets.Where(a => a.Location == currentUser.Location)).Select(x => new ReportDTO
        {
            Category = x.Name,
            Available = x.Assets.Count(a => a.State == Enum.AssetState.Available && a.IsDisabled == false && a.Location == currentUser.Location),
            NotAvailable = x.Assets.Count(a => a.State == Enum.AssetState.NotAvailable && a.IsDisabled == false && a.Location == currentUser.Location),
            Assigned = x.Assets.Count(a => a.State == Enum.AssetState.Assigned && a.IsDisabled == false && a.Location == currentUser.Location),
            WaitingForRecycling = x.Assets.Count(a => a.State == Enum.AssetState.WaitingForRecycling && a.IsDisabled == false && a.Location == currentUser.Location),
            Recycled = x.Assets.Count(a => a.State == Enum.AssetState.Recycled && a.IsDisabled == false && a.Location == currentUser.Location),
            Total = x.Assets.Count(a => a.IsDisabled == false && a.Location == currentUser.Location)
        });

        if (!string.IsNullOrEmpty(fieldName))
        {
            if (sortType == "asc")
            {
                switch (fieldName)
                {
                    case "category":
                        reports = reports.OrderBy(r => r.Category);
                        break;
                    case "assigned":
                        reports = reports.OrderBy(r => r.Assigned);
                        break;
                    case "available":
                        reports = reports.OrderBy(r => r.Available);
                        break;
                    case "notAvailable":
                        reports = reports.OrderBy(r => r.NotAvailable);
                        break;
                    case "recycled":
                        reports = reports.OrderBy(r => r.Recycled);
                        break;
                    case "waitingForRecycling":
                        reports = reports.OrderBy(r => r.WaitingForRecycling);
                        break;
                    case "total":
                        reports = reports.OrderBy(r => r.Total);
                        break;
                }
            }
            else if (sortType == "desc")
            {
                switch (fieldName)
                {
                    case "category":
                        reports = reports.OrderByDescending(r => r.Category);
                        break;
                    case "assigned":
                        reports = reports.OrderByDescending(r => r.Assigned);
                        break;
                    case "available":
                        reports = reports.OrderByDescending(r => r.Available);
                        break;
                    case "notAvailable":
                        reports = reports.OrderByDescending(r => r.NotAvailable);
                        break;
                    case "recycled":
                        reports = reports.OrderByDescending(r => r.Recycled);
                        break;
                    case "waitingForRecycling":
                        reports = reports.OrderByDescending(r => r.WaitingForRecycling);
                        break;
                    case "total":
                        reports = reports.OrderByDescending(r => r.Total);
                        break;
                }
            }
        }

        var listReport = await reports.Skip(page * limit).Take(limit).ToListAsync();
        return new ReportPagingModel
        {
            Reports = listReport,
            TotalItem = count,
            Page = page + 1,
            LastPage = (int)Math.Ceiling(Decimal.Divide(count, limit))
        };
    }
    public async Task<List<ReportDTO>> GetAllReport(User currentUser)
    {
        int count = await _context.Categories.CountAsync();
        var reports = await _context.Categories.Include(c => c.Assets.Where(a => a.Location == currentUser.Location)).Select(x => new ReportDTO
        {
            Category = x.Name,
            Available = x.Assets.Count(a => a.State == Enum.AssetState.Available && a.IsDisabled == false && a.Location == currentUser.Location),
            NotAvailable = x.Assets.Count(a => a.State == Enum.AssetState.NotAvailable && a.IsDisabled == false && a.Location == currentUser.Location),
            Assigned = x.Assets.Count(a => a.State == Enum.AssetState.Assigned && a.IsDisabled == false && a.Location == currentUser.Location),
            WaitingForRecycling = x.Assets.Count(a => a.State == Enum.AssetState.WaitingForRecycling && a.IsDisabled == false && a.Location == currentUser.Location),
            Recycled = x.Assets.Count(a => a.State == Enum.AssetState.Recycled && a.IsDisabled == false && a.Location == currentUser.Location),
            Total = x.Assets.Count(a => a.IsDisabled == false && a.Location == currentUser.Location)
        }).OrderBy(r => r.Category).ToListAsync();

        return reports;
    }

}