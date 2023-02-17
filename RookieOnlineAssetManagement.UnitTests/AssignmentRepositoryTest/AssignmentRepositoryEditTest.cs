using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models;
using RookieOnlineAssetManagement.Models.Assignment;
using RookieOnlineAssetManagement.Profiles;
using RookieOnlineAssetManagement.Repositories;
using RookieOnlineAssetManagement.UnitTests.TestData;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace RookieOnlineAssetManagement.UnitTests.RepositoryTest
{
    public class AssignmentRepositoryEditTest : IDisposable
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly List<Assignment> _assignments;
        private readonly List<User> _users;
        public AssignmentRepositoryEditTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("AssignmentEditTestDB").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new AssignmentProfile())).CreateMapper();
            _context.Database.EnsureDeleted();
            _assignments = AssignmentTestData.GetAssignments();
            _users = UserTestData.GetUsers();
            _context.Assignments.AddRange(_assignments);
            _context.Users.AddRange(_users);
            _context.SaveChanges();
        }

        [Fact]
        public void GetAssignmentEditById_ValidId_ShouldReturnAssignmentDetailEditDTOWithSameId()
        {
            //Arrange
            var assignmentId = 1; // parameter
            var assignmentFake = _assignments.FirstOrDefault(m => m.Id == 1);

            AssignmentRepository assignmentRepo = new AssignmentRepository(_mapper, _context);

            // Act
            var result = assignmentRepo.GetAssignmentEditById(assignmentId).Result;

            // Assert
            Assert.NotNull(result);
            Assert.IsType<AssignmentDetailEditDTO>(result);
            Assert.Equal(assignmentFake.Id, result.Id);
        }

        [Fact]
        public void EditAssignmentAsync_ValidId_ShouldReturnAssignmentDTO()
        {
            //Arrange
            var assignmentId = 1; // parameter
            var userFake = _users.FirstOrDefault(m => m.Id == "1");
            EditAssignmentModel editAssignmentModel = new EditAssignmentModel()
            {
                StaffCode = userFake.StaffCode,
                AssetCode = "1",
                AssignedDate = DateTime.Now,
                Note = ""
            };

            AssignmentRepository assignmentRepo = new AssignmentRepository(_mapper, _context);

            // Act
            var result = assignmentRepo.EditAssignmentAsync(assignmentId, editAssignmentModel).Result;

            // Assert
            Assert.NotNull(result);
            Assert.IsType<AssignmentDTO>(result);
            Assert.Equal(userFake.UserName, result.AssignedTo);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }

}
