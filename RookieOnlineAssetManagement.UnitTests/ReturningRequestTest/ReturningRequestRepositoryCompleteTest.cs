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
    public class ReturningRequestRepositoryCompleteTest
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly List<ReturningRequest> _returningRequest;
        public ReturningRequestRepositoryCompleteTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("CompletedReturingRequestTestDB").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new ReturningRequestProfile())).CreateMapper();
            _returningRequest = ReturnRequestTestData.ReturningRequests();
            _context.Database.EnsureDeleted();
            _context.ReturningRequests.AddRange(_returningRequest);
            _context.SaveChanges();
        }
        [Fact]
        public async Task CompleteReturningRequest_SuccessAsync_ShouldReturningRequestCompleteModel()
        {
            //Arrange
            var returningRequest = 1;
            var assignmentId = 1;
            var idUser = "123";
            User userLogin = new() { Id = idUser };
            var returningRequestFake = ReturnRequestTestData.ReturningRequests().FirstOrDefault(x => x.Id == returningRequest);

            ReturningRequestRepository repository = new ReturningRequestRepository(_mapper, _context);
            // Act
            var result = await repository.CompleteReturningRequest(returningRequest, userLogin);
            // Assert
            Assert.NotNull(result);
            Assert.Equal(result.State, Enum.ReturningRequestState.Completed);
            Assert.IsType<ReturningRequestDTO>(result);
        }
    }
}