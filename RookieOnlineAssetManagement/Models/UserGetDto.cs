using RookieOnlineAssetManagement.Enum;
using System;

namespace RookieOnlineAssetManagement.Models
{
    public class UserGetDto
    {
       
        public string UserName { get; set; }
        public string StaffCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime JoinedDate { get; set; }
        public DateTime DateofBirth { get; set; }
        public string Gender { get; set; }
        public UserType Type { get; set; }
    }
}
