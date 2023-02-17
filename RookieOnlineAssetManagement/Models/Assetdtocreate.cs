using Duende.IdentityServer.Models;
using RookieOnlineAssetManagement.Enum;
using System;
using System.ComponentModel.DataAnnotations;

namespace RookieOnlineAssetManagement.Models
{
    public class AssetDto
    {
        [Required(ErrorMessage = "This field is required")]
        public int? CategoryId { get; set; }
        public string CategoryName { get; set; }

        [Required(ErrorMessage = "This field is required")]
        public string AssetName { get; set; }

        public string Specification { get; set; }

        [Required(ErrorMessage = "This field is required")]
        public DateTime InstalledDate { get; set; }

        [Required(ErrorMessage = "This field is required")]
        public AssetState State { get; set; }
        public string Location { get; set; } = null!;
        public string AssetCode { get; set; }
    }
}
