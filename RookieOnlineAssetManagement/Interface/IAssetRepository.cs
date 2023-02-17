using Microsoft.CodeAnalysis;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Interface
{
    public interface IAssetRepository
    {
        public Task<AssetPagingViewModel> GetListAsset(int page,User userLogin,string filterByState,string filterByCategory,string searchString,string sort,string sortBy);
        public Task<List<AssetHistoryModel>> GetListHistoryOfAsset(string assetCode);
        Task<AssetPagingModel> GetAssetsAsync(SearchParameters parameters);
        Task<AssetPagingModel> GetAvailableAssetsAsync(SearchParameters parameters, string location);
        public Task<AssetDto> AssetCreateAsync(AssetCreateDTO assetCreateDTO, User user);
        Task<AssetDTO> GetAsset(string assetCode);
        Task<AssetEditDTO> UpdateAssetAsync(AssetEditDTO assetEditDTO);
        Task<int> CheckAssetCanDeleteAsync(string assetCode);
        Task<Asset> DeleteAssetAsync(string assetCode);
        public Task<ReportPagingModel> GetReport(string fieldName, string sortType, int page, int limit, User currentUser);
        public Task<List<ReportDTO>> GetAllReport(User currentUser);
    }
}

