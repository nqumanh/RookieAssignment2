using RookieOnlineAssetManagement.Enum;
using System;

namespace RookieOnlineAssetManagement.Models
{
    public class UserModel
    {
        public string Id { get; set; }
        public string StaffCode { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public DateTime JoinedDate { get; set; }
        public DateTime DateofBirth { get; set; }
        public Gender Gender { get; set; }
        public string Location { get; set; } = null!;
        public UserType Type { get; set; }
        public bool isDisabled { get; set; }
    }
}
