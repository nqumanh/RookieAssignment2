using MessagePack;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RookieOnlineAssetManagement.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Prefix { get; set; }
        public string Name { get; set; }
        public bool IsDisabled { get; set; }

        public virtual ICollection<Asset> Assets { get; } = new List<Asset>();

    }
}
