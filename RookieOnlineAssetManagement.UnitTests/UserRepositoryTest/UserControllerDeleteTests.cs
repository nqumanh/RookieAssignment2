using Microsoft.AspNetCore.Mvc;
using Moq;
using RookieOnlineAssetManagement.Controllers;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Interface;
using System.Net;
using Xunit;

namespace RookieOnlineAssetManagement.UnitTests.UserRepositoryTest
{
    public class UserControllerDeleteTests
    {
        [Fact]
        public void UserRepository_DeleteUser_ValidId()
        {
            // Arrange
            string userId = "123";
            var mockRepo = new Mock<IUserRepository>();
            mockRepo.Setup(repo => repo.DeleteUserAsync(userId)).ReturnsAsync(new User { Id = "123" });
            var controller = new UsersController(null, null, mockRepo.Object);
            // Act
            var result = controller.DeleteUser(userId).Result as ObjectResult;
            var actualtResult = result.Value;
            // Assert
            Assert.IsType<OkObjectResult>(result);
            Assert.Equal(userId, ((User)actualtResult).Id);
            //Assert.True(((User)actualtResult).IsDisabled);
            Assert.Equal(HttpStatusCode.OK, (HttpStatusCode)result.StatusCode);
        }
    }
}
