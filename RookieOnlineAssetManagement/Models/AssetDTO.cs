using System;
using RookieOnlineAssetManagement.Enum;

namespace RookieOnlineAssetManagement.Models
{
    public class AssetDTO
    {
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string Specification { get; set; }
        public DateTime InstalledDate { get; set; }
        public AssetState State { get; set; }
        public string Location { get; set; }
        public string Category { get; set; }
    }
}