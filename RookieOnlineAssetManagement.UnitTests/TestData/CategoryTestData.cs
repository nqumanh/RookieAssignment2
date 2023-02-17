using RookieOnlineAssetManagement.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.UnitTests.TestData
{
    public class CategoryTestData
    {
        public static List<Category> GetCategories()
        {
            return new List<Category>() {
                new Category() {
                    Id = 1,
                    Prefix = "BM",
                    Name = "Bluetooth mouse",
                    IsDisabled = false,
                },
                new Category() {
                    Id = 2,
                    Prefix = "LA",
                    Name = "Laptop",
                    IsDisabled = false,
                },
                new Category() {
                    Id = 3,
                    Prefix = "PC",
                    Name = "Personal computer",
                    IsDisabled = false,
                },
                new Category() {
                    Id = 4,
                    Prefix = "MO",
                    Name = "Monitor",
                    IsDisabled = false,
                },
            };
        }
    }
}
