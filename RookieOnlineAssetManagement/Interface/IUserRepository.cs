using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Interface
{
    public interface IUserRepository
    {
        public Task<List<UserDTO>> GetAllAsync(User userLogin);
        public Task<UserDTO> CreateAsync(CreateUserDTO model, User user);
        public Task<List<UserModel>> FindUser(string find, User userLogin, string type);
        public Task<List<UserModel>> GetAllAsync(int page, User userLogin);
        Task<UserPagingModel> GetUsersAsync(SearchParameters parameters, string location);
        public Task<List<UserModel>> GetUserByType(int page, string type, User userLogin);
        public Task<List<UserModel>> SortUser(string sort, User userLogin, string type, string find, string sortBy);
        public Task<UserDTO> GetAsync(string staffCode);
        public Task<UserEditDto> UpdateAsync(UserEditDto userDto);
        public Task<int> CheckUserCanDeleteAsync(string id);
        public Task<User> DeleteUserAsync(string userId);
        public Task AddLocation(string staffCode, string location);
    }
}
