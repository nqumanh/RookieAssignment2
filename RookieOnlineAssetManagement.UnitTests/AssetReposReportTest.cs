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

namespace RookieOnlineAssetManagement.UnitTests
{
    public class AssetReposReportTest : IDisposable
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
        public AssetReposReportTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("ReportTest").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new ReportProfile())).CreateMapper();
            _userManager = new(new Mock<IUserStore<User>>().Object, null, null, null, null, null, null, null, null);

            _categories = new()
            {
                new Category(){Name = "Laptop",Prefix ="LA", IsDisabled = false},
                new Category(){Name = "Monitor", Prefix ="MO", IsDisabled = false},
                new Category(){Name = "Personal Computer",Prefix ="PC", IsDisabled = false},
                new Category(){Name = "Mouse",Prefix ="MS", IsDisabled = false},
                new Category(){Name = "KeyBoard",Prefix ="KB", IsDisabled = false}
            };
            _assets = new()
            {
                new Asset(){ AssetName = "Laptop",AssetCode = "LA000001",Location = "HCM", IsDisabled = false, State = Enum.AssetState.Available,Category = _categories[0] },
                new Asset(){ AssetName = "Monitor",AssetCode = "MO000001",Location = "HN", IsDisabled = false,State = Enum.AssetState.NotAvailable,Category = _categories[1]},
                new Asset(){ AssetName = "Personal Computer",AssetCode = "PC000001",Location = "HCM", IsDisabled = false,State = Enum.AssetState.NotAvailable,Category = _categories[2]},
                new Asset(){ AssetName = "Mouse",AssetCode = "MS000001",Location = "HCM", IsDisabled = false,State = Enum.AssetState.Available,Category = _categories[3]},
                new Asset(){ AssetName = "KeyBoard",AssetCode = "KB000001",Location = "HCM", IsDisabled = false,State = Enum.AssetState.Available,Category = _categories[4]}
            };

            _context.Database.EnsureDeleted();
            _context.Assets.AddRange(_assets);
            _context.Categories.AddRange(_categories);
            _context.SaveChanges();
        }

        [Theory]
        [InlineData("available", "asc", 1, 5, "HCM")]
        [InlineData("notAvailable", "desc", 1, 5, "HCM")]
        public void GetAllAsync_Success(string fieldname, string sorttype, int page, int limit, string location)
        {
            User currentUser = new()
            {
                Location = location
            };
            AssetRepository repository = new AssetRepository(_mapper, _context, _userManager.Object);
            var result = repository.GetReport(fieldname, sorttype, page, limit, currentUser).Result;
            Assert.NotNull(result.Reports);
            Assert.NotEmpty(result.Reports);
            Assert.Equivalent(_mapper.Map<List<ReportDTO>>(_categories.Where(u => u.IsDisabled == false && u.Assets.FirstOrDefault().Location == currentUser.Location)
                                                                      .Skip((result.Page - 1) * limit)
                                                                      .Take(limit)
                                                                      .ToList()), result.Reports);

        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
