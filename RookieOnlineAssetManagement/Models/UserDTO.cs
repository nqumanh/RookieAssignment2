using RookieOnlineAssetManagement.Enum;
using System;
using System.ComponentModel.DataAnnotations;

namespace RookieOnlineAssetManagement.Models
{
    public class UserDTO
    {
        public string Id { get; set; }

        [Display(Name = "FirstName")]
        [Required(ErrorMessage = "FirstName is required")]
        public string FirstName { get; set; }

        [Display(Name = "LastName")]
        [Required(ErrorMessage = "LastName is required")]
        public string LastName { get; set; }
        [Required(ErrorMessage = "UserName is required")]
        public string UserName { get; set; }

        [Display(Name = "DateofBirth")]
        [Required(ErrorMessage = "DateofBirth is required")]
        public DateTime DateofBirth { get; set; }

        [Display(Name = "JoinedDate")]
        [Required(ErrorMessage = "Joined Date is required")]
        public DateTime JoinedDate { get; set; }

        [Display(Name = "Type")]
        [Required(ErrorMessage = "Type is required")]
        public UserType Type { get; set; }

        [Display(Name = "Gender")]
        [Required(ErrorMessage = "Gender is required")]
        public Gender Gender { get; set; }
        public string Location { get; set; } = null!;
        public string StaffCode { get; set; }
    }
}