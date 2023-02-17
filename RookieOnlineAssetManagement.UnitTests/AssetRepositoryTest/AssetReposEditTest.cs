using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models;
using RookieOnlineAssetManagement.Profiles;
using RookieOnlineAssetManagement.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace RookieOnlineAssetManagement.UnitTests.AssetRepositoryTest
{
    public class AssetReposEditTest : IDisposable
    {
        public class UserManagerMoq : UserManager<User>
        {
            public UserManagerMoq() : base(
                    new Mock<IUserStore<User>>().Object,
                    new Mock<IOptions<IdentityOptions>>().Object,
                    new Mock<IPasswordHasher<User>>().Object,
                    new IUserValidator<User>[0],
                    new IPasswordValidator<User>[0],
                    new Mock<ILookupNormalizer>().Object,
                    new Mock<IdentityErrorDescriber>().Object,
                    new Mock<IServiceProvider>().Object,
                    new Mock<ILogger<UserManager<User>>>().Object
                )
            {

            }
        }
        private readonly Mock<UserManager<User>> _userManager;
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly List<Asset> _assets;
        private readonly List<Category> _categories;
        public AssetReposEditTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("EditAssetTestDB").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new AssetProfile())).CreateMapper();
            _userManager = new(new Mock<IUserStore<User>>().Object, null, null, null, null, null, null, null, null);
            _categories = new()
            {
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
            _assets = new()
            {
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
            _context.Database.EnsureDeleted();
            //_context.Categories.AddRange(_categories);
            _context.Assets.AddRange(_assets);
            _context.SaveChanges();
        }
        [Theory]
        [InlineData("BM00001")]
        [InlineData("LA000001")]
        public void Get_Success(string assetcode)
        {
            AssetRepository repository = new AssetRepository(_mapper, _context, _userManager.Object);
            var result = repository.GetAsset(assetcode).Result;
            Assert.NotNull(result);
            Assert.Equal(_mapper.Map<AssetDTO>(_assets.FirstOrDefault(u => u.AssetCode == assetcode)).AssetCode, result.AssetCode);
            Assert.Equal(_mapper.Map<AssetDTO>(_assets.FirstOrDefault(u => u.AssetCode == assetcode)).AssetName, result.AssetName);
        }

        [Theory]
        [InlineData("BM00001", "Chuột Bluetooth Targus B581", "abc", "2021-07-21", Enum.AssetState.Recycled)]
        [InlineData("LA000001", "Laptop huawei matebook 14", "abc", "2021-07-21", Enum.AssetState.Recycled)]
        public void Update_Success(string assetcode, string assetname, string specification, DateTime installedDate, Enum.AssetState assetState)
        {

            AssetEditDTO assetEditDto = new() { AssetCode = assetcode, AssetName = assetname, Specification = specification, InstalledDate = installedDate, State = assetState };

            AssetRepository repository = new AssetRepository(_mapper, _context, _userManager.Object);
            var result = repository.UpdateAssetAsync(assetEditDto).Result;
            Assert.NotNull(result);
            Assert.Equivalent(_context.Assets.FirstOrDefault(u => u.AssetCode == assetcode).AssetName.ToString(), result.AssetName);
            Assert.Equivalent(_context.Assets.FirstOrDefault(u => u.AssetCode == assetcode).Specification, result.Specification);
            Assert.Equivalent(_context.Assets.FirstOrDefault(u => u.AssetCode == assetcode).State, result.State);
        }


        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
