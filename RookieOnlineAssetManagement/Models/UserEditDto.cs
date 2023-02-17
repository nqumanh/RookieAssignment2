using System;
using RookieOnlineAssetManagement.Enum;

namespace RookieOnlineAssetManagement.Models
{
    public class UserEditDto
    {
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string StaffCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime JoinedDate { get; set; }
        public Gender Gender { get; set; }
        public DateTime DateofBirth { get; set; }
        public UserType Type { get; set; }
        public string Location { get; set; }
    }
}
