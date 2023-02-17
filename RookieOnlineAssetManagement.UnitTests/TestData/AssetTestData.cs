using RookieOnlineAssetManagement.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.UnitTests.TestData
{
    public  class AssetTestData
    {
        public static List<Asset> GetAssets()
        {
            return new List<Asset>() {
                new Asset() {
                    AssetCode = "BM00001",
                    AssetName = "Chuột Bluetooth Targus B581",
                    Specification = "abc",
                    InstalledDate = DateTime.Now,
                    State = Enum.AssetState.Recycled,
                    IsDisabled = false,
                    Location="HCM",
                    Category = new Category()
                },
                new Asset() {
                    AssetCode = "BM00002",
                    AssetName = "Chuột Bluetooth Rapoo M100 Silent",
                    Specification = "abc",
                    InstalledDate = DateTime.Now,
                    State = Enum.AssetState.Recycled,
                    IsDisabled = false,
                    Location="HCM",
                    Category = new Category()
                },
                new Asset() {
                    AssetCode = "LA000001",
                    AssetName = "Laptop huawei matebook 14",
                    Specification = "abc",
                    InstalledDate = DateTime.Now,
                    State = Enum.AssetState.Recycled,
                    IsDisabled = false,
                    Location="HCM",
                    Category = new Category()
                },
                new Asset() {
                    AssetCode = "MO00001",
                    AssetName = "Laptop huawei matebook 14",
                    Specification = "abc",
                    InstalledDate = DateTime.Now,
                    State = Enum.AssetState.Recycled,
                    IsDisabled = false,
                    Location="HCM",
                    Category = new Category()
                },
            };
        }
    }
}
