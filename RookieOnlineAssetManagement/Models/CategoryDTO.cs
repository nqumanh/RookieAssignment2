using Duende.IdentityServer.Models;
using RookieOnlineAssetManagement.Enum;
using System.ComponentModel.DataAnnotations;

namespace RookieOnlineAssetManagement.Models
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Please enter Category Name")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Please enter Category Prefix")]
        public string Prefix { get; set; }

        public CategotyCheck CategoryCheck { get; set; }
    }
}
