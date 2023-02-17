using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
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
    public class AssetReposDeleteTest : IDisposable
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
        public AssetReposDeleteTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("DeleteAssetTestDB").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new AssetProfile())).CreateMapper();
            _userManager = new(new Mock<IUserStore<User>>().Object, null, null, null, null, null, null, null, null);
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
            _context.Assets.AddRange(_assets);
            _context.SaveChanges();
        }

        [Theory]
        [InlineData("BM00001")]
        [InlineData("BM00002")]
        [InlineData("LA000001")]
        public void Delete_Success(string assetcode)
        {
            AssetRepository repository = new AssetRepository(_mapper, _context, _userManager.Object);
            var result = repository.DeleteAssetAsync(assetcode).Result;
            Assert.NotNull(result);
            Assert.Equal(_assets.FirstOrDefault(u => u.AssetCode == assetcode).IsDisabled, result.IsDisabled);
        }
        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
