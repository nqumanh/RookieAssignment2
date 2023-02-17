using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Enum;
using RookieOnlineAssetManagement.Models;
using RookieOnlineAssetManagement.Models.Assignment;
using RookieOnlineAssetManagement.Profiles;
using RookieOnlineAssetManagement.Repositories;
using RookieOnlineAssetManagement.UnitTests.TestData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace RookieOnlineAssetManagement.UnitTests.RepositoryTest
{

    public class AssignmentRepositoryTest : IDisposable
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly List<Assignment> _assignments;
        private readonly List<Asset> _assets;
        public AssignmentRepositoryTest()
        {
            _assets = new()
            {
                new Asset(){ AssetName = "Laptop",AssetCode = "BM00001", Location = "HCM", IsDisabled = false, State = Enum.AssetState.Available },
                new Asset(){ AssetName = "Monitor",AssetCode = "MO000001",Location = "HN", IsDisabled = false,State = Enum.AssetState.NotAvailable},
                new Asset(){ AssetName = "Personal Computer",AssetCode = "PC000001",Location = "HCM", IsDisabled = true,State = Enum.AssetState.NotAvailable},
                new Asset(){ AssetName = "KeyBoard",AssetCode = "KB000001",Location = "HCM", IsDisabled = true,State = Enum.AssetState.NotAvailable}
            };
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("AssignmentTestDB").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new AssignmentProfile())).CreateMapper();
            _context.Database.EnsureDeleted();
            _assignments = AssignmentTestData.GetAssignments();
            _context.Assignments.AddRange(_assignments);
            _context.Assets.AddRange(_assets);
            _context.SaveChanges();
        }

        [Fact]
        public void GetAssignmentById_ValidId_ShouldReturnAssignmentDTO()
        {
            //Arrange
            var assignmentId = 1; 
            var assignmentFake = AssignmentTestData.FakeAssignment(); 

            AssignmentRepository assignmentRepo = new AssignmentRepository(_mapper, _context);

            // Act
            var result = assignmentRepo.GetAssignmentById(assignmentId).Result;

            // Assert
            Assert.NotNull(result);
            Assert.IsType<AssignmentDetailDTO>(result);
            Assert.Equal(assignmentFake.Id, result.Id);
        }
        [Fact]
        public void GetAssignmentById_AssignmentNotHaveInDatabase_ShouldReturnNull()
        {
            //Arrange
            var assignmentId = 10; // parameter
            AssignmentRepository assignmentRepo = new AssignmentRepository(_mapper, _context);

            // Act
            var result = assignmentRepo.GetAssignmentById(assignmentId).Result;

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void AcceptAssignmentById_ValidId_StateShouldBeChangeToAccepted()
        {
            //Arrange
            var assignmentId = 1; // parameter
            AssignmentRepository assignmentRepo = new AssignmentRepository(_mapper, _context);

            // Act
            var result = assignmentRepo.AcceptAssignmentById(assignmentId).Result;

            // Assert
            Assert.NotNull(result);
            Assert.Equal(Enum.AssignmentState.Accepted, result.State);
        }
        [Fact]
        public void AcceptAssignmentById_AssignmentNotHaveInDatabase_ShouldReturnNull()
        {
            //Arrange
            var assignmentId = 10; // parameter
            AssignmentRepository assignmentRepo = new AssignmentRepository(_mapper, _context);

            // Act
            var result = assignmentRepo.AcceptAssignmentById(assignmentId).Result;

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void DeclineAssignmentById_ValidId_IsDisabledPropShouldBeTrue()
        {
            //Arrange
            var assignmentId = 1;
             // parameter
            AssignmentRepository assignmentRepo = new AssignmentRepository(_mapper, _context);

            // Act
            var result = assignmentRepo.DisabledAssignmentById(assignmentId).Result;

            // Assert
            Assert.NotNull(result);
            Assert.True(result.IsDisabled);
        }
        [Fact]
        public void DeclineAssignmentById_AssignmentNotHaveInDatabase_ShouldReturnNull()
        {
            //Arrange
            var assignmentId = 10; // parameter
            AssignmentRepository assignmentRepo = new AssignmentRepository(_mapper, _context);

            // Act
            var result = assignmentRepo.DisabledAssignmentById(assignmentId).Result;

            // Assert
            Assert.Null(result);
        }

        [Theory]
        [InlineData("UserB", null, null, 5, 5)]
        [InlineData("UserB", "assetCode", "asc", 5, 5)]
        [InlineData("UserB", "assetName", "asc", 5, 5)]
        [InlineData("UserB", "category", "asc", 5, 5)]
        [InlineData("UserB", "assignedDate", "asc", 5, 5)]
        [InlineData("UserB", "state", "asc", 5, 5)]
        [InlineData("UserB", "assetCode", "desc", 5, 5)]
        [InlineData("UserB", "assetName", "desc", 5, 5)]
        [InlineData("UserB", "category", "desc", 5, 5)]
        [InlineData("UserB", "assignedDate", "desc", 5, 5)]
        [InlineData("UserB", "state", "desc", 5, 5)]
        public void GetAssignmentListOfUserById_ValidUserIdOfAssigment_TotalItemShouldBeMoreThanZero(string userId, string fieldName, string sortType, int queryPage, int limit)
        {
            //Arrange
            AssignmentRepository assignmentRepo = new AssignmentRepository(_mapper, _context);

            // Act
            var result = assignmentRepo.GetAssignmentListOfUserById(userId, fieldName, sortType, queryPage, limit);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<AssignmentPagingModel>(result);
            Assert.True(((AssignmentPagingModel)result).TotalItem > 0);
        }
        [Theory]
        [InlineData("A", null, null, 5, 5)]
        [InlineData("A", "assetCode", "asc", 5, 5)]
        [InlineData("A", "assetName", "asc", 5, 5)]
        [InlineData("A", "category", "asc", 5, 5)]
        [InlineData("A", "assignedDate", "asc", 5, 5)]
        [InlineData("A", "state", "asc", 5, 5)]
        [InlineData("A", "assetCode", "desc", 5, 5)]
        [InlineData("A", "assetName", "desc", 5, 5)]
        [InlineData("A", "category", "desc", 5, 5)]
        [InlineData("A", "assignedDate", "desc", 5, 5)]
        [InlineData("A", "state", "desc", 5, 5)]
        public void GetAssignmentListOfUserById_InvalidUserIdOfAssigment_TotalItemShouldBeByZero(string userId, string fieldName, string sortType, int queryPage, int limit)
        {
            //Arrange
            AssignmentRepository assignmentRepo = new AssignmentRepository(_mapper, _context);

            // Act
            var result = assignmentRepo.GetAssignmentListOfUserById(userId, fieldName, sortType, queryPage, limit);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<AssignmentPagingModel>(result);
            Assert.False(((AssignmentPagingModel)result).TotalItem > 0);
        }

        [Fact]
        public void CreateAssignmentAsync_WhenValidInput_ShouldReturnNewAssignment()
        {
            //Arrange
            DateTime currentDateTime = DateTime.Now;
            var assignment = new CreateAssignmentModel
            {
                StaffCode = "SD0002",
                AssetCode = "BM00001",
                AssignedDate = currentDateTime,
                Note = "Test Note"
            };
            var assignor = UserTestData.GetUsers().FirstOrDefault(x => x.StaffCode == "SD0001");
            AssignmentRepository assignmentRepo = new AssignmentRepository(_mapper, _context);

            // Act
            var result = assignmentRepo.CreateAssignmentAsync(assignor, assignment).Result;

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task CreateAssignmentAsync_WhenValidCreateAssignmentModel_ShouldReturnNewAssignment()
        {
            //Arrange
            DateTime currentDateTime = DateTime.Now;
            var assignment = new CreateAssignmentModel
            {
                StaffCode = "SD0002",
                AssetCode = "BM00001",
                AssignedDate = currentDateTime,
                Note = "Test Note"
            };
            var assignor = UserTestData.GetUsers().FirstOrDefault(x => x.StaffCode == "SD0001");

            var assignee = _context.Users.FirstOrDefault(x => x.StaffCode == assignment.StaffCode);
            var asset = _context.Assets.FirstOrDefault(x => x.AssetCode == assignment.AssetCode);
            var newAssignment = new Assignment
            {
                AssignedByUser = assignor,
                AssignedToUser = assignee,
                Asset = asset,
                AssignedDate = assignment.AssignedDate,
                State = AssignmentState.WaitingForAcceptance,
                Note = assignment.Note,
            };

            // Act
            await _context.Assignments.AddAsync(newAssignment);
            await _context.SaveChangesAsync();
            var assignmentDTO = _mapper.Map<AssignmentDTO>(newAssignment);
            var result = assignmentDTO;

            // Assert
            Assert.NotNull(result);
            Assert.IsType<AssignmentDTO>(result);
        }

        [Fact]
        public void GetAsync_WhenId_ShouldAssignmentDtoWithSameId()
        {
            //Arrange
            var id = 1; // parameter
            AssignmentRepository assignmentRepo = new AssignmentRepository(_mapper, _context);

            // Act
            var result = assignmentRepo.GetAsync(id).Result;

            // Assert
            Assert.NotNull(result);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
