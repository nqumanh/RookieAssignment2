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
    public class ReturningRequestRepositoryCancelTest
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly List<ReturningRequest> _returningRequest;
        public ReturningRequestRepositoryCancelTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("CancelReturingRequestTestDB").Options;
            _context = new ApplicationDbContext(_options);
            _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new ReturningRequestProfile())).CreateMapper();
            _returningRequest = new()
            {
                new ReturningRequest() {Id = 1, State = ReturningRequestState.Completed, IsDisabled = false },
                new ReturningRequest() {Id = 2, State = ReturningRequestState.WaitingForReturning, IsDisabled = false }
            };
            _context.Database.EnsureDeleted();
            _context.ReturningRequests.AddRange(_returningRequest);
            _context.SaveChanges();
        }

        [Fact]
        public async Task CancelReturningRequest_SuccessAsync_ShouldReturnTrue()
        {
            //Arrange
            var returningRequestId = 2;
            ReturningRequestRepository repository = new(_mapper, _context);

            // act
            var result = await repository.DisabledReturningRequestById(returningRequestId);

            //assert
            Assert.True(result);
        }

        [Fact]
        public async Task CancelReturningRequest_WrongId_ShouldReturnFalse()
        {
            //Arrange
            var returningRequestId = 3;
            ReturningRequestRepository repository = new(_mapper, _context);

            // act
            var result = await repository.DisabledReturningRequestById(returningRequestId);

            //assert
            Assert.False(result);
        }
    }
}