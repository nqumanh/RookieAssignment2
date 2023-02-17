using System.Collections.Generic;

namespace RookieOnlineAssetManagement.Models
{
    public class AssetPagingModel
    {
        public int Total { get; set; }
        public List<AssetDTO> Assets { get; set; }
    }
}
