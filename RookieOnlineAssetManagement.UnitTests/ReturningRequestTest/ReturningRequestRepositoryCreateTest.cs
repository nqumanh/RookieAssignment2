using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Enum;
using RookieOnlineAssetManagement.Models;
using RookieOnlineAssetManagement.Profiles;
using RookieOnlineAssetManagement.Repositories;
using RookieOnlineAssetManagement.UnitTests.TestData;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace RookieOnlineAssetManagement.UnitTests.RepositoryRepositoryTest
{
    public class ReturningRequestRepositoryCreateTest
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly List<Assignment> _assignment;
        public ReturningRequestRepositoryCreateTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("CreateReturingRequestTestDB").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new ReturningRequestProfile())).CreateMapper();
            _assignment = AssignmentTestData.GetAssignmentsForCreate();
            _context.Database.EnsureDeleted();
            _context.Assignments.AddRange(_assignment);
            _context.SaveChanges();
        }
        [Fact]
        public async Task CreateReturningRequest_SuccessAsync_ShouldReturningRequestCreateModel()
        {
            //Arrange
            var assignmentId = 1;
            var idUser = "123";
            User userLogin = new() { Id = idUser };
            var assignmentFake = AssignmentTestData.GetAssignmentsForCreate().Where(p => p.Id == assignmentId && p.IsDisabled == false && p.State == AssignmentState.Accepted).FirstOrDefault();

            ReturningRequestRepository repository = new ReturningRequestRepository(_mapper, _context);
            // Act
            var result = await repository.CreateReturningRequest(assignmentId, userLogin);
            // Assert
            Assert.NotNull(result);
            Assert.IsType<ReturningRequestCreateModel>(result);
            Assert.Equal(result.RequestById, idUser);
        }
        [Fact]
        public async Task CreateReturningRequest_AssignmentStateIsWaiting_ShouldReturnNull()
        {
            //Arrange
            var assignmentId = 2;
            var idUser = "123";
            User userLogin = new() { Id = idUser };
            var assignmentFake = AssignmentTestData.GetAssignmentsForCreate().Where(p => p.Id == assignmentId && p.IsDisabled == false && p.State == AssignmentState.Accepted).FirstOrDefault();

            ReturningRequestRepository repository = new ReturningRequestRepository(_mapper, _context);
            // Act
            var result = await repository.CreateReturningRequest(assignmentId, userLogin);
            // Assert
            Assert.Null(result);
        }
    }
}