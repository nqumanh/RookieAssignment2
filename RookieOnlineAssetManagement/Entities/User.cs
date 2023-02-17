using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Reflection;
using System;
using RookieOnlineAssetManagement.Enum;

namespace RookieOnlineAssetManagement.Entities
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public DateTime JoinedDate { get; set; }
        public DateTime DateofBirth { get; set; }
        public Gender Gender { get; set; }
        public UserType Type { get; set; }
        public string Location { get; set; } = null!;
        public bool IsDisabled { get; set; }
        public string StaffCode { get; set; }
        public bool FirstLogin { get; set; }
        public virtual ICollection<Assignment> AssignedByAssignments { get; } = new List<Assignment>();
        public virtual ICollection<Assignment> AssignedToAssignments { get; } = new List<Assignment>();
    }
}
