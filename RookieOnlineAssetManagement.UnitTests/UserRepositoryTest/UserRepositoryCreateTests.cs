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
using System.Threading.Tasks;
using Xunit;

namespace RookieOnlineAssetManagement.UnitTests.UserRepositoryTest
{
    public class UserRepositoryCreateTests : IDisposable
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
        private readonly List<User> _users;
        public UserRepositoryCreateTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("CreateUserTestDB").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new UserProfile())).CreateMapper();
            _userManager = new(new Mock<IUserStore<User>>().Object, null, null, null, null, null, null, null, null);
            _users = new()
            {
                new User(){ UserName = "phucnv"},
                new User(){ UserName = "phucnv1"},
                new User(){ UserName = "binhnv1"}
            };

            _context.Database.EnsureDeleted();
            _context.Users.AddRange(_users);
            _context.SaveChanges();
        }
        [Theory]
        [InlineData("Manh", "Nguyen Van ", "1991-07-21", "2021-07-21", Enum.UserType.Staff, Enum.Gender.Male, "HN")]
        [InlineData("Dung", "Nguyen Van ", "1992-08-22", "2022-08-22", Enum.UserType.Staff, Enum.Gender.Female, "HCM")]
        public async Task Create_SuccessAsync(string FirstName, string LastName, DateTime DateofBirth, DateTime JoinedDate, Enum.UserType Type, Enum.Gender Gender, string location)
        {
            User useradmin = new() { Location = location };
            CreateUserDTO user = new()
            {
                FirstName = FirstName,
                LastName = LastName,
                DateofBirth = DateofBirth,
                JoinedDate = JoinedDate,
                Type = Type,
                Gender = Gender
            };
            _userManager.Setup(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
            UserRepository repository = new UserRepository(_mapper, _context, _userManager.Object);

            var result = await repository.CreateAsync(user, useradmin);

            Assert.NotNull(result);
            Assert.IsType<UserDTO>(result);
            Assert.Equal(result.FirstName, user.FirstName);
            Assert.Equal(result.LastName, user.LastName);

        }
        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}