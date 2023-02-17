using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Enum;
using System;

namespace RookieOnlineAssetManagement.Models
{
    public class AssetModel
    {
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string CategoryName { get; set; }
        public DateTime InstalledDate { get; set; }
        public string Location { get; set; }
        public string Specification { get; set; }
        public AssetState State { get; set; }

    }
}
