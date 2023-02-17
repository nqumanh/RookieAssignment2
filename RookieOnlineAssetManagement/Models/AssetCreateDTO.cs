using Duende.IdentityServer.Models;
using RookieOnlineAssetManagement.Enum;
using System;
using System.ComponentModel.DataAnnotations;

namespace RookieOnlineAssetManagement.Models
{
    public class AssetCreateDTO
    {
        [Required(ErrorMessage = "This field is required")]
        public int? CategoryId { get; set; }

        [Required(ErrorMessage = "This field is required")]
        public string AssetName { get; set; }

        public string Specification { get; set; }

        [Required(ErrorMessage = "This field is required")]
        public DateTime InstalledDate { get; set; }

        [Required(ErrorMessage = "This field is required")]
        public AssetState State { get; set; }
    }
}
