using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.UnitTests.TestData
{
    public class UserTestData
    {
        public static List<User> GetUsers()
        {
            return new List<User>() {
                new User(){Id = "1", StaffCode = "SD0001", UserName = "phucnv",FirstName = "phuc", LastName ="nguyen" , IsDisabled = true, Location = "HCM", Type = Enum.UserType.Admin },
                new User(){Id = "2", StaffCode = "SD0002", UserName = "phucnv1",FirstName = "thien", LastName ="nguyen",IsDisabled = false, Location = "HCM",Type = Enum.UserType.Staff },
                new User(){Id = "3", StaffCode = "SD0003", UserName = "binhnv1",FirstName = "manh", LastName ="nguyen",IsDisabled = false, Location = "HN", Type = Enum.UserType.Admin },
                new User(){Id = "4", StaffCode = "SD0004", UserName = "phucnv2",FirstName = "linh", LastName ="nguyen",IsDisabled = false, Location = "HN",Type = Enum.UserType.Staff},
                new User(){Id = "5", StaffCode = "SD0005", UserName = "phucnv3",FirstName = "phuc1", LastName ="nguyen" , IsDisabled = false, Location = "HCM", Type = Enum.UserType.Admin  },
                new User(){Id = "6", StaffCode = "SD0006", UserName = "phucnv4",FirstName = "thien1", LastName ="nguyen",IsDisabled = false, Location = "HCM",Type = Enum.UserType.Staff },
                new User(){Id = "7", StaffCode = "SD0007", UserName = "binhnv2",FirstName = "manh1", LastName ="nguyen",IsDisabled = true, Location = "HN", Type = Enum.UserType.Admin },
                new User(){Id = "8", StaffCode = "SD0008", UserName = "phucnv5",FirstName = "linh1", LastName ="nguyen",IsDisabled = true, Location = "HN",Type = Enum.UserType.Staff }
            };
        }
    }
}
