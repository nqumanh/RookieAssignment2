using Xunit;
using System;
using AutoMapper;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Models;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Profiles;
using RookieOnlineAssetManagement.Repositories;
using RookieOnlineAssetManagement.UnitTests.TestData;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.UnitTests.RepositoryRepositoryTest;
public class ReturningRequestRepositoryViewTest
{
    private readonly DbContextOptions<ApplicationDbContext> _options;
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly List<ReturningRequest> _returningRequests;
    public ReturningRequestRepositoryViewTest()
    {
        _options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase("ViewReturingRequestTestDB").Options;
        _context = new ApplicationDbContext(_options);
        _mapper = new MapperConfiguration(cfg => cfg.AddProfile(new ReturningRequestProfile())).CreateMapper();
        _returningRequests = ReturnRequestTestData.ReturningRequests();
        _context.Database.EnsureDeleted();
        _context.ReturningRequests.AddRange(_returningRequests);
        _context.SaveChanges();
    }

    [Theory]
    [InlineData(1, 10, 0, "0001-01-01", "", true, "No.")]
    [InlineData(1, 10, 0, "0001-01-01", "", true, "Asset Code")]
    [InlineData(1, 10, 0, "0001-01-01", "", true, "Asset Name")]
    [InlineData(1, 10, 0, "0001-01-01", "", true, "Requested by")]
    [InlineData(1, 10, 0, "0001-01-01", "", true, "Accepted by")]
    [InlineData(1, 10, 0, "0001-01-01", "", true, "Returned Date")]
    [InlineData(1, 10, 0, "0001-01-01", "", true, "State")]

    [InlineData(1, 10, 0, "0001-01-01", "", false, "No.")]
    [InlineData(1, 10, 0, "0001-01-01", "", false, "Asset Code")]
    [InlineData(1, 10, 0, "0001-01-01", "", false, "Asset Name")]
    [InlineData(1, 10, 0, "0001-01-01", "", false, "Requested by")]
    [InlineData(1, 10, 0, "0001-01-01", "", false, "Accepted by")]
    [InlineData(1, 10, 0, "0001-01-01", "", false, "Returned Date")]
    [InlineData(1, 10, 0, "0001-01-01", "", false, "State")]

    [InlineData(1, 10, 0, "2022-12-01", "", true, "Asset Code")]
    [InlineData(1, 10, 1, "0001-01-01", "", true, "Asset Code")]
    [InlineData(1, 10, 0, "0001-01-01", null, true, "Asset Code")]

    public void GetReturningRequestsAsync_WhenExistValidReturningRequest_ShouldReturnReturningRequestList(
        int pageNumber,
        int pageSize,
        int filterState,
        DateTime returnedDate,
        string searchString,
        bool sortType,
        string sortBy)
    {
        //Arrange
        ReturningRequestRepository repository = new ReturningRequestRepository(_mapper, _context);
        string location = "HCM";
        var returningRequestParameters = new ReturningRequestParameters
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            FilterState = filterState,
            ReturnedDate = returnedDate,
            SearchString = searchString,
            SortBy = sortBy,
            SortType = sortType
        };

        // Act
        var result = repository.GetReturningRequestsAsync(returningRequestParameters, location);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<Task<ReturningRequestPagingModel>>(result);
    }
}