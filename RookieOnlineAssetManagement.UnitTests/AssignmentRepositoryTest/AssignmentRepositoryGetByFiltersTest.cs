using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NuGet.ContentModel;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models;
using RookieOnlineAssetManagement.Profiles;
using RookieOnlineAssetManagement.Repositories;
using RookieOnlineAssetManagement.UnitTests.TestData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Asset = RookieOnlineAssetManagement.Entities.Asset;

namespace RookieOnlineAssetManagement.UnitTests.RepositoryTest
{
    public class AssignmentRepositoryGetByFiltersTest : IDisposable
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly List<Assignment> _assignments;
        private readonly List<Asset> _assets;
        private readonly List<User> _users;

        public AssignmentRepositoryGetByFiltersTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("AssignmentsTestDB").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new AssignmentProfile())).CreateMapper();
            _assets = new()
            {
                new Asset {AssetCode = "BM00001", AssetName = "Chuột Bluetooth Targus B581", Specification = "abc", IsDisabled = false, Location="HCM"},
                new Asset {AssetCode = "BM00002", AssetName = "Chuột Bluetooth Rapoo M100 Silent", Specification = "def", IsDisabled = false, Location="HN"},
                new Asset {AssetCode = "LA000001", AssetName = "Laptop huawei matebook 14", Specification = "ghj", IsDisabled = false, Location="HCM"},
                new Asset {AssetCode = "LA000002", AssetName = "Laptop Lenovo Ideapad 3 15ITL6 i5 1135G7 Xám", Specification = "klm", IsDisabled = false, Location="HCM"},
                new Asset {AssetCode = "MO00001", AssetName = "Monitor Dell UltraSharp", Specification = "nop", IsDisabled = false, Location="HCM"}
            };
            _users = new()
            {
                new User(){Id = "1", StaffCode = "SD0001", UserName = "phucnv",FirstName = "phuc", LastName ="nguyen" , IsDisabled = true, Location = "HCM", Type = Enum.UserType.Admin },
                new User(){Id = "2", StaffCode = "SD0002", UserName = "phucnv1",FirstName = "thien", LastName ="nguyen",IsDisabled = false, Location = "HCM",Type = Enum.UserType.Staff },
                new User(){Id = "3", StaffCode = "SD0003", UserName = "binhnv1",FirstName = "manh", LastName ="nguyen",IsDisabled = false, Location = "HN", Type = Enum.UserType.Admin },
                new User(){Id = "4", StaffCode = "SD0004", UserName = "phucnv2",FirstName = "linh", LastName ="nguyen",IsDisabled = false, Location = "HN",Type = Enum.UserType.Staff},
                new User(){Id = "5", StaffCode = "SD0005", UserName = "phucnv3",FirstName = "phuc1", LastName ="nguyen" , IsDisabled = false, Location = "HCM", Type = Enum.UserType.Admin  },
                new User(){Id = "6", StaffCode = "SD0006", UserName = "phucnv4",FirstName = "thien1", LastName ="nguyen",IsDisabled = false, Location = "HCM",Type = Enum.UserType.Staff },
                new User(){Id = "7", StaffCode = "SD0007", UserName = "binhnv2",FirstName = "manh1", LastName ="nguyen",IsDisabled = true, Location = "HN", Type = Enum.UserType.Admin },
                new User(){Id = "8", StaffCode = "SD0008", UserName = "phucnv5",FirstName = "linh1", LastName ="nguyen",IsDisabled = true, Location = "HN",Type = Enum.UserType.Staff }
            };
            _assignments = new()
            {
                new Assignment() {Id = 1, Asset = _assets[0], AssignedBy = "2", AssignedTo = "1", AssignedDate = new DateTime(2020, 12, 3), State = Enum.AssignmentState.WaitingForAcceptance, IsDisabled = false, Note = "test 1"},
                new Assignment() {Id = 2, Asset = _assets[0], AssignedBy = "4", AssignedTo = "3", AssignedDate = new DateTime(2020, 12, 3), State = Enum.AssignmentState.Accepted, IsDisabled = false, Note = "test 2"},
                new Assignment() {Id = 3, Asset = _assets[0], AssignedBy = "6", AssignedTo = "5", AssignedDate = new DateTime(2020, 12, 5), State = Enum.AssignmentState.WaitingForAcceptance, IsDisabled = false, Note = "test 3"},
                new Assignment() {Id = 4, Asset = _assets[0], AssignedBy = "8", AssignedTo = "7", AssignedDate = new DateTime(2020, 12, 6), State = Enum.AssignmentState.Accepted, IsDisabled = false, Note = "test 4"},
                new Assignment() {Id = 5, Asset = _assets[0], AssignedBy = "2", AssignedTo = "1", AssignedDate = new DateTime(2020, 12, 7), State = Enum.AssignmentState.WaitingForAcceptance, IsDisabled = true, Note = "test 5"},
            };
            _context.Database.EnsureDeleted();
            _context.Assets.AddRange(_assets);
            _context.Users.AddRange(_users);
            _context.Assignments.AddRange(_assignments);
            _context.SaveChanges();
        }

        [Fact]
        public void GetAssignmentsByFiltersAsync_WhenDefaultFiltersAndFirstPage_ShouldReturnAssignmentsExceptDisabledOnes()
        {
            //Arrange
            var pageNumber = 1;
            var pageSize = 5;
            AssignmentFilters filters = new AssignmentFilters
            {
                State = "All",
                AssignedDate = null,
                SearchWords = "",
                SortBy = "No",
                SortType = "asc"
            };
            var currentUser = _users[0];

            AssignmentRepository assignmentRepo = new AssignmentRepository(_mapper, _context);
            var expectedAssignments = _mapper.Map<List<AssignmentGetDTO>>(_context.Assignments.Where(assingment => assingment.IsDisabled == false));

            // Act
            var result = assignmentRepo.GetAssignmentsByFiltersAsync(pageNumber, pageSize, filters, currentUser).Result;

            // Assert
            Assert.NotNull(result);
            Assert.Equivalent(expectedAssignments, result);
        }

        [Fact]
        public void CountAssignmentsAfterFilterAsync_WhenDefaultFilters_ShouldNumberOfAssignments()
        {
            //Arrange
            AssignmentFilters filters = new AssignmentFilters
            {
                State = "All",
                AssignedDate = null,
                SearchWords = "",
                SortBy = "No",
                SortType = "asc"
            };
            var currentUser = _users[0];
            var assignmentNumber = AssignmentTestData.GetAssignments().Where(a => a.IsDisabled == false).Count();
            AssignmentRepository assignmentRepo = new AssignmentRepository(_mapper, _context);

            // Act
            var result = assignmentRepo.CountAssignmentsAfterFilterAsync(filters, currentUser).Result;

            // Assert
            Assert.Equal(assignmentNumber, result);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
