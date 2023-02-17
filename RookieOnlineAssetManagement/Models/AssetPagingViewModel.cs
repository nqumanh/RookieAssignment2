using System.Collections.Generic;

namespace RookieOnlineAssetManagement.Models
{
    public class AssetPagingViewModel
    {
        public int AssetTotal { get; set; }
        public List<AssetModel> AssetList { get; set; }
    }
}
