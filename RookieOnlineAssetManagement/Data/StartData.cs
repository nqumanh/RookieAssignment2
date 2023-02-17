using Microsoft.AspNetCore.Identity;
using System;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Enum;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Data;
public static class StartData
{
    public static async Task Initialize(UserManager<User> userManager)
    {
        var users = new List<User> {
                new User
                {
                    FirstName = "Duy",
                    LastName = "Nguyen",
                    UserName = "duyn",
                    DateofBirth = new DateTime(2000, 1, 1),
                    JoinedDate = DateTime.Now,
                    Gender = Gender.Male,
                    Type = UserType.Admin,
                    StaffCode = "SD9999",
                    Location = "HCM",
                    IsDisabled = false,
                    FirstLogin = false,
                },
                new User
                {
                    FirstName = "Giang",
                    LastName = "Vo",
                    UserName = "giangvoadmin",
                    DateofBirth = new DateTime(2000, 1, 1),
                    JoinedDate = DateTime.Now,
                    Gender = Gender.Female,
                    Type = UserType.Admin,
                    StaffCode = "SD9991",
                    Location = "HN",
                    IsDisabled = false,
                    FirstLogin = false,
                },
            };

        foreach (var user in users)
        {
            var userInDb = userManager.FindByNameAsync(user.UserName).Result;
            if (userInDb == null)
            {
                var password = $"{user.UserName}@{user.DateofBirth.ToString("ddMMyyyy")}@{user.Location.Replace(" ", "")}";
                await userManager.CreateAsync(user, password);
            }
        }
    }
}
