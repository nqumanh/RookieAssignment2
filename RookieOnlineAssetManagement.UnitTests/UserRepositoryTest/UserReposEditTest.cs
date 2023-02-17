using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Profiles;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using Moq;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using RookieOnlineAssetManagement.Repositories;
using RookieOnlineAssetManagement.Models;
using MessagePack.Formatters;

namespace RookieOnlineAssetManagement.UnitTests.UserRepositoryTest
{
    public class UserReposEditTest
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

        public UserReposEditTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("EditUserTestDB").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new UserProfile())).CreateMapper();
            _userManager = new(new Mock<IUserStore<User>>().Object, null, null, null, null, null, null, null, null);

            _users = new()
            {
                new User(){Id = "246ebdce-6888-4f6f-8608-76947fc108b6", StaffCode = "SD0001", UserName = "phucnv",FirstName = "phuc", LastName ="nguyen" , IsDisabled = true, Location = "HCM", Type = Enum.UserType.Admin },
                new User(){Id = "2c3233e9-e2cd-4743-9c94-1585cf0b4352", StaffCode = "SD0002", UserName = "phucnv1",FirstName = "thien", LastName ="nguyen",IsDisabled = false, Location = "HCM",Type = Enum.UserType.Staff },
                new User(){Id = "2f74ecae-acb3-4380-8b66-40281ec49685", StaffCode = "SD0003", UserName = "binhnv1",FirstName = "manh", LastName ="nguyen",IsDisabled = false, Location = "HN", Type = Enum.UserType.Admin },
                new User(){Id = "300988ca-2d96-4177-b01c-e6cc7b41cb4f", StaffCode = "SD0004", UserName = "phucnv2",FirstName = "linh", LastName ="nguyen",IsDisabled = false, Location = "HN",Type = Enum.UserType.Staff},
                new User(){Id = "38965451-bf3e-4e1d-ae6a-937b00beba28", StaffCode = "SD0005", UserName = "phucnv3",FirstName = "phuc1", LastName ="nguyen" , IsDisabled = false, Location = "HCM", Type = Enum.UserType.Admin  },
                new User(){Id = "39b5228b-31d4-4e08-85be-54dda43213a1", StaffCode = "SD0006", UserName = "phucnv4",FirstName = "thien1", LastName ="nguyen",IsDisabled = false, Location = "HCM",Type = Enum.UserType.Staff },
                new User(){Id = "43e4286b-1e16-4559-a0d8-e0f3a8dcbf19", StaffCode = "SD0007", UserName = "binhnv2",FirstName = "manh1", LastName ="nguyen",IsDisabled = true, Location = "HN", Type = Enum.UserType.Admin },
                new User(){Id = "457d2523-8d0f-4700-b424-bbae963c89c0", StaffCode = "SD0008", UserName = "phucnv5",FirstName = "linh1", LastName ="nguyen",IsDisabled = true, Location = "HN",Type = Enum.UserType.Staff }
            };
            _context.Database.EnsureDeleted();
            _context.Users.AddRange(_users);
            _context.SaveChanges();

        }
        [Theory]
        [InlineData("SD0001")]
        [InlineData("SD0002")]
        [InlineData("SD0003")]
        public void Get_Success(string staffcode)
        {
            UserRepository repository = new UserRepository(_mapper, _context, _userManager.Object);
            var result = repository.GetAsync(staffcode).Result;
            Assert.NotNull(result);
            Assert.Equal(_mapper.Map<UserDTO>(_users.FirstOrDefault(u => u.StaffCode == staffcode)).StaffCode, result.StaffCode);
            Assert.Equal(_mapper.Map<UserDTO>(_users.FirstOrDefault(u => u.StaffCode == staffcode)).UserName, result.UserName);
        }

        [Theory]
        [InlineData("SD0004", Enum.Gender.Female, Enum.UserType.Admin, "2000-06-15")]
        [InlineData("SD0005", Enum.Gender.Female, Enum.UserType.Admin, "1999-06-15")]
        [InlineData("SD0006", Enum.Gender.Female, Enum.UserType.Admin, "1998-06-15")]
        [InlineData("SD0007", Enum.Gender.Female, Enum.UserType.Admin, "1997-06-15")]
        public void Update_Success(string staffcode, Enum.Gender gender, Enum.UserType type, DateTime dateofbirth)
        {

            UserEditDto userEditDto = new() { StaffCode = staffcode, Gender = gender, Type = type, DateofBirth = dateofbirth };

            UserRepository repository = new UserRepository(_mapper, _context, _userManager.Object);
            var result = repository.UpdateAsync(userEditDto).Result;
            Assert.NotNull(result);
            Assert.Equivalent(_context.Users.FirstOrDefault(u => u.StaffCode == staffcode).StaffCode.ToString(), result.StaffCode);
            Assert.Equivalent(_context.Users.FirstOrDefault(u => u.StaffCode == staffcode).Gender, result.Gender);
            Assert.Equivalent(_context.Users.FirstOrDefault(u => u.StaffCode == staffcode).Type, result.Type);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
