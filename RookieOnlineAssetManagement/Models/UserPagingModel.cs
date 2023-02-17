using System.Collections.Generic;

namespace RookieOnlineAssetManagement.Models
{
    public class UserPagingModel
    {
        public int Total { get; set; }
        public List<UserDTO> Users { get; set; }
    }
}
