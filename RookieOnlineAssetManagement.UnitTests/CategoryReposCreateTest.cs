using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using NuGet.ContentModel;
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
    public class CategoryReposCreateTest : IDisposable
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
        private readonly List<Category> _catagories;
        public CategoryReposCreateTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("CreateCategoryTestDB").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new CategoryProfile())).CreateMapper();
            _userManager = new(new Mock<IUserStore<User>>().Object, null, null, null, null, null, null, null, null);
           
            _catagories = new()
            {
                new Category(){Id = 1, Name = "Laptop",Prefix = "LA" },
                new Category(){Id = 2, Name = "Monitor",Prefix ="MO" },
            };
            _context.Database.EnsureDeleted();
            _context.Categories.AddRange(_catagories);
            _context.SaveChanges();
        }

        [Theory]
        [InlineData( "Keyboard", "KE")]
        [InlineData( "Mouse", "ME" )]
        public async Task Create_SuccessAsync( String name, String prefix)
        {
            CategoryDTO category = new()
            {
                Name = name,
                Prefix = prefix
            };
            _userManager.Setup(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
            CategoryRepository repository = new CategoryRepository(_mapper, _context, _userManager.Object);

            var result = await repository.CategoryCreateAsync(category);

            Assert.NotNull(result);
            Assert.IsType<CategoryDTO>(result);
            Assert.Equal(result.Name, category.Name);
            Assert.Equal(result.Prefix, category.Prefix);
        }
        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
