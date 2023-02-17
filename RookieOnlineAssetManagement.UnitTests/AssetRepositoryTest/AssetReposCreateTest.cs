using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
    public class AssetReposCreateTest : IDisposable
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
        private readonly List<Category> _catagories;
        public AssetReposCreateTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("CreateAssetTestDB").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new AssetProfile())).CreateMapper();
            _userManager = new(new Mock<IUserStore<User>>().Object, null, null, null, null, null, null, null, null);
            _assets = new()
            {
                new Asset(){ AssetName = "Laptop",AssetCode = "LA000001"},
                new Asset(){ AssetName = "Monitor",AssetCode = "MO000001"},
                new Asset(){ AssetName = "Personal Computer",AssetCode = "PC000001"}
            };
            _catagories = new()
            {
                new Category(){Id = 1, Name = "Laptop",Prefix = "LA" },
                new Category(){Id = 2, Name = "Monitor",Prefix ="MO" },
            };
            _context.Database.EnsureDeleted();
            _context.Assets.AddRange(_assets);
            _context.Categories.AddRange(_catagories);
            _context.SaveChanges();
        }

        [Theory]
        [InlineData(1, "Laptop", "Laptop Dell", "2021-07-21", Enum.AssetState.Available, "HN")]
        [InlineData(2, "Monitor", "LG 1052", "2022-08-22", Enum.AssetState.NotAvailable, "HCM")]
        public async Task Create_SuccessAsync(int categoryId, string assetName, string specification, DateTime installedDate, Enum.AssetState state, string location)
        {
            User useradmin = new() { Location = location };
            AssetCreateDTO asset = new()
            {
                CategoryId = categoryId,
                AssetName = assetName,
                Specification = specification,
                InstalledDate = installedDate,
                State = state
            };
            _userManager.Setup(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
            AssetRepository repository = new AssetRepository(_mapper, _context, _userManager.Object);

            var result = await repository.AssetCreateAsync(asset, useradmin);

            Assert.NotNull(result);
            Assert.IsType<AssetDto>(result);
            Assert.Equal(result.AssetName, asset.AssetName);
            Assert.Equal(result.State, asset.State);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
