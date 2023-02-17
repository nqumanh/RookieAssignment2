using RookieOnlineAssetManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Interface
{
    public interface ICategoryRepository
    {
        public  Task<List<CategoryModel>> GetListCategory();
        public Task<CategoryDTO> CategoryCreateAsync(CategoryDTO CategoryDTO);
        public Task<List<CategoryDTO>> GetAllAsync();
    }
}
