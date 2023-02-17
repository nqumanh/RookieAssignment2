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
    public class AssetReposViewTest : IDisposable
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
        public AssetReposViewTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("ViewAssetTestDB").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new AssetProfile())).CreateMapper();
            _userManager = new(new Mock<IUserStore<User>>().Object, null, null, null, null, null, null, null, null);

            _categories = new()
            {
                new Category(){Name = "Laptop", IsDisabled = false},
                new Category(){Name = "Monitor", IsDisabled = false}
            };
            _assets = new()
            {
                new Asset(){ AssetName = "Laptop",AssetCode = "LA000001",Location = "HCM", IsDisabled = false, State = Enum.AssetState.Available },
                new Asset(){ AssetName = "Monitor",AssetCode = "MO000001",Location = "HN", IsDisabled = false,State = Enum.AssetState.NotAvailable},
                new Asset(){ AssetName = "Personal Computer",AssetCode = "PC000001",Location = "HCM", IsDisabled = true,State = Enum.AssetState.NotAvailable}
            };

            _context.Database.EnsureDeleted();
            _context.Assets.AddRange(_assets);
            _context.Categories.AddRange(_categories);
            _context.SaveChanges();
        }

        [Theory]
        [InlineData("HCM")]
        public void GetAllAsync_Success(string location)
        {
            User useradmin = new() { Location = location };
            string filerByState = "Available NotAvailable";
            string filterByCategory = "null";
            string searchString = "Laptop";
            string sortBy = "Ascending";
            string sort = "Asset Code";
            AssetRepository repository = new AssetRepository(_mapper, _context, _userManager.Object);
            var result = repository.GetListAsset(1, useradmin, filerByState, filterByCategory, searchString, sort, sortBy).Result;
            Assert.NotNull(result.AssetList);
            Assert.NotEmpty(result.AssetList);
            Assert.Equivalent(_mapper.Map<List<AssetModel>>(_assets.Where(u => u.IsDisabled == false && u.Location == useradmin.Location)), result.AssetList);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}