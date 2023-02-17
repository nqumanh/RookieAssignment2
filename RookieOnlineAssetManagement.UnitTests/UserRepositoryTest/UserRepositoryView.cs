
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
using Xunit;

namespace RookieOnlineAssetManagement.UnitTests.UserRepositoryTest
{
    public class UserRepositoryView : IDisposable
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
        private readonly UserManagerMoq _userManager;
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly List<User> _users;
        public UserRepositoryView()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("UserTestDB").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new UserProfile())).CreateMapper();

            _users = new()
            {
                new User(){StaffCode = "SD0001", UserName = "phucnv",FirstName = "phuc", LastName ="nguyen" , IsDisabled = true, Location = "HCM", Type = Enum.UserType.Admin },
                new User(){StaffCode = "SD0002", UserName = "phucnv1",FirstName = "thien", LastName ="nguyen",IsDisabled = false, Location = "HCM",Type = Enum.UserType.Staff },
                new User(){StaffCode = "SD0003", UserName = "binhnv1",FirstName = "manh", LastName ="nguyen",IsDisabled = false, Location = "HN", Type = Enum.UserType.Admin },
                new User(){StaffCode = "SD0004", UserName = "phucnv2",FirstName = "linh", LastName ="nguyen",IsDisabled = false, Location = "HN",Type = Enum.UserType.Staff},
                new User(){StaffCode = "SD0005", UserName = "phucnv3",FirstName = "phuc1", LastName ="nguyen" , IsDisabled = false, Location = "HCM", Type = Enum.UserType.Admin  },
                new User(){StaffCode = "SD0006", UserName = "phucnv4",FirstName = "thien1", LastName ="nguyen",IsDisabled = false, Location = "HCM",Type = Enum.UserType.Staff },
                new User(){StaffCode = "SD0007", UserName = "binhnv2",FirstName = "manh1", LastName ="nguyen",IsDisabled = true, Location = "HN", Type = Enum.UserType.Admin },
                new User(){StaffCode = "SD0008", UserName = "phucnv5",FirstName = "linh1", LastName ="nguyen",IsDisabled = true, Location = "HN",Type = Enum.UserType.Staff }
            };
            _context.Database.EnsureDeleted();
            _context.Users.AddRange(_users);
            _context.SaveChanges();
        }
        [Theory]
        [InlineData(1, "HCM")]
        [InlineData(1, "HN")]
        public void GetAllAsync_Success(int page, string location)
        {
            User useradmin = new() { Location = location };
            UserRepository repository = new UserRepository(_mapper, _context, _userManager);
            var result = repository.GetAllAsync(page, useradmin).Result;
            Assert.NotNull(result);
            Assert.NotEmpty(result);
            Assert.Equivalent(_mapper.Map<List<UserModel>>(_users.Where(u => u.IsDisabled == false && u.Location == useradmin.Location)), result);
        }

        [Theory]
        [InlineData("Admin", "HCM")]
        [InlineData("Staff", "HN")]
        [InlineData("Admin", "HN")]
        [InlineData("Staff", "HCM")]
        [InlineData("", "HCM")]
        public void GetUserByType_Success(string Type, string Location)
        {
            Enum.UserType UserTypes = new Enum.UserType();
            if (Type == "Admin")
            {
                UserTypes = Enum.UserType.Admin;
            }
            else if (Type == "Staff")
            {
                UserTypes = Enum.UserType.Staff;
            }

            User useradmin = new() { Location = Location };
            UserRepository repository = new UserRepository(_mapper, _context, _userManager);
            var result = repository.GetUserByType(0, Type, useradmin).Result;
            Assert.NotNull(result);
            Assert.NotEmpty(result);
            Assert.Equivalent(_mapper.Map<List<UserModel>>(_users.Where(u => u.IsDisabled == false && u.Location == useradmin.Location && u.Type == UserTypes)), result);
        }

        [Theory]
        [InlineData("SD", "HCM")]
        //[InlineData("Ng", "HN")]
        public void FindUser_Success(string Find, string Location)
        {
            User useradmin = new() { Location = Location };
            var result_check = _mapper.Map<List<UserModel>>(_users.Where(u => u.IsDisabled == false
            && u.Location == useradmin.Location
            && u.StaffCode.ToUpper().Contains(Find.ToUpper())));
            if (result_check.Count == 0)
            {
                result_check = _mapper.Map<List<UserModel>>(_users.Where(u => u.IsDisabled == false
                                && u.Location == useradmin.Location
                                && u.UserName.ToUpper().Contains(Find.ToUpper())));

            }
            UserRepository repository = new UserRepository(_mapper, _context, _userManager);
            var result = repository.FindUser(Find, useradmin, "All").Result;
            Assert.NotNull(result);
            Assert.NotEmpty(result);
            Assert.Equivalent(result_check, result);
        }
        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
