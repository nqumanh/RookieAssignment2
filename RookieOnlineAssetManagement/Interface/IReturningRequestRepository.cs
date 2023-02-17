using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Interface
{
    public interface IReturningRequestRepository
    {
        public Task<ReturningRequestCreateModel> CreateReturningRequest(int assignmentId, User userLogin);
        Task<ReturningRequestPagingModel> GetReturningRequestsAsync(ReturningRequestParameters parameters, string location);
        Task<ReturningRequestDTO> CompleteReturningRequest(int id,User currentUser);
        public Task<bool> DisabledReturningRequestById(int requestId);
    }
}


