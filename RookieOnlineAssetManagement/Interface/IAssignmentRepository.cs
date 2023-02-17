using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models;
using RookieOnlineAssetManagement.Models.Assignment;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Interface
{
    public interface IAssignmentRepository
    {
        AssignmentPagingModel GetAssignmentListOfUserById(string userId, string fieldName, string sortType, int page, int limit);        
        Task<AssignmentDetailDTO> GetAssignmentById(int assignmentId);
        Task<AssignmentDetailEditDTO> GetAssignmentEditById(int assignmentId);
        Task<Assignment> AcceptAssignmentById(int assignmentId);
        Task<Assignment> DisabledAssignmentById(int assignmentId);
        Task<AssignmentDTO> CreateAssignmentAsync(User assignor, CreateAssignmentModel assignment);
        Task<AssignmentDTO> EditAssignmentAsync(int idAssignment, EditAssignmentModel assignment);
        Task<AssignmentDTO> GetAsync(int id);
        public Task<int> CountAssignmentsAfterFilterAsync(AssignmentFilters filters, User currentUser);
        public Task<List<AssignmentGetDTO>> GetAssignmentsByFiltersAsync(int pageNumber, int pageSize, AssignmentFilters filters, User currentUser);
    }
}


