using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RookieOnlineAssetManagement.Models;
using Microsoft.AspNetCore.Authorization;
using RookieOnlineAssetManagement.Interface;
using Microsoft.AspNetCore.Identity;
using RookieOnlineAssetManagement.Entities;
using System;
using RookieOnlineAssetManagement.Repositories;
using System.Collections.Generic;

namespace RookieOnlineAssetManagement.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AssetsController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IAssetRepository _assetRepository;
    public AssetsController(UserManager<User> userManager, IAssetRepository assetRepository)
    {
        _userManager = userManager;
        _assetRepository = assetRepository;
    }

    [HttpGet("[action]")]
    public async Task<ActionResult<AssetPagingModel>> GetAssets([FromQuery] SearchParameters parameters)
    {
        var result = await _assetRepository.GetAssetsAsync(parameters);
        return Ok(result);
    }

    [HttpGet("[action]")]
    public async Task<ActionResult<AssetPagingModel>> GetAvailableAssets([FromQuery] SearchParameters parameters)
    {
        var admin = await _userManager.GetUserAsync(User);
        var result = await _assetRepository.GetAvailableAssetsAsync(parameters, admin.Location);
        return Ok(result);
    }
    [HttpGet("{page}/{filterByState}/{filterByCategory}/{searchString}/{sort}/{sortBy}")]
    public async Task<ActionResult<AssetPagingViewModel>> GetListAsset(int page, string filterByState, string filterByCategory, string searchString, string sort, string sortBy)
    {
        var userLogin = await _userManager.GetUserAsync(User);
        var listAsset = await _assetRepository.GetListAsset(page, userLogin, filterByState, filterByCategory, searchString, sort, sortBy);
        return Ok(listAsset);
    }
    [HttpGet("{assetCode}")]
    public async Task<ActionResult<AssetHistoryModel>> GetHistory(string assetCode)
    {
        var assets = await _assetRepository.GetListHistoryOfAsset(assetCode);
        return Ok(assets);
    }

    [HttpGet("[action]")]
    public async Task<ActionResult<ReportPagingModel>> GetReport(string fieldName, string sortType, int page, int limit)
    {
        var currentUser = await _userManager.GetUserAsync(User);
        var listReport = await _assetRepository.GetReport(fieldName, sortType, page, limit, currentUser);
        if (listReport != null)
        {
            return Ok(listReport);
        }
        return NotFound();
    }

    [HttpGet("[action]")]
    public async Task<ActionResult<List<ReportDTO>>> GetAllReport()
    {
         var currentUser = await _userManager.GetUserAsync(User);
        var listReport = await _assetRepository.GetAllReport(currentUser);
        if (listReport != null)
        {
            return Ok(listReport);
        }
        return NotFound();
    }

    [HttpPost("[action]")]
    public async Task<ActionResult> CreateAsset(AssetCreateDTO model)
    {
        var user = await _userManager.GetUserAsync(User);
        if (ModelState.IsValid)
        {
            AssetDto newAsset = await _assetRepository.AssetCreateAsync(model, user);
            if (newAsset == null)
            {
                return BadRequest("Invalid Category");
            }
            else
            {
                return Ok(newAsset);
            }
        }
        return BadRequest();
    }
    [HttpGet("get/{assetcode}")]
    public async Task<ActionResult<AssetDTO>> GetByAssetCode(string assetCode)
    {
        var asset = await _assetRepository.GetAsset(assetCode);
        if (asset == null)
        {
            return BadRequest("Can not find the asset");
        }
        return Ok(asset);
    }
    [HttpPut("[action]")]
    public async Task<ActionResult<AssetEditDTO>> EditAsset(AssetEditDTO assetEditDTO)
    {
        if (ModelState.IsValid)
        {
            var asset = await _assetRepository.UpdateAssetAsync(assetEditDTO);

            return Ok(asset);
        }
        return BadRequest();
    }
    [HttpGet("checkasset/{assetCode}")]
    public async Task<ActionResult> CheckUserCanDelete(string assetCode)
    {
        var assignment = await _assetRepository.CheckAssetCanDeleteAsync(assetCode);
        return Ok(assignment);
    }

    [HttpPut("delete/{assetCode}")]
    public async Task<IActionResult> DeleteAsset(string assetCode)
    {
        var asset = await _assetRepository.DeleteAssetAsync(assetCode);
        if (asset != null && asset.State != Enum.AssetState.Assigned)
        {
            return Ok(asset);
        }
        else
        {
            return BadRequest("Failed action");
        }
    }
}