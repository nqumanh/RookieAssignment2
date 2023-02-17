using RookieOnlineAssetManagement.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RookieOnlineAssetManagement.Entities
{
    public class Asset
    {
        [Key]
        public string AssetCode { get; set; }
        public string AssetName { get; set; }
        public string Specification { get; set; }
        public DateTime InstalledDate { get; set; }
        public AssetState State { get; set; }
        public string Location { get; set; }
        public bool IsDisabled { get; set; }

        public virtual Category Category { get; set; }

        public virtual ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}
