using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Interface;
using RookieOnlineAssetManagement.Models;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using RookieOnlineAssetManagement.Enum;

namespace RookieOnlineAssetManagement.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ICategoryRepository _categoryRepository;
        public CategoriesController(UserManager<User> userManager, ICategoryRepository categoryRepository)
        {
            _userManager = userManager;
            _categoryRepository = categoryRepository;
        }
        [HttpGet]
        public async Task<ActionResult<CategoryModel>> GetListCategory()
        {
            var list =await _categoryRepository.GetListCategory();
            return Ok(list);
        }
        [HttpGet("[action]")]
        public async Task<ActionResult<List<CategoryDTO>>> GetAll()
        {
            var categoryList = await _categoryRepository.GetAllAsync();
            if (categoryList == null)
            {
                return NotFound();
            }
            return Ok(categoryList);
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> CreateCategory(CategoryDTO model)
        {
            if (ModelState.IsValid)
            {
               
                var newCategory = await _categoryRepository.CategoryCreateAsync(model);
                if (newCategory.CategoryCheck == CategotyCheck.CheckName)
                {
                    return BadRequest("Category is already existed. Please enter a different category");
                }
                else if (newCategory.CategoryCheck == CategotyCheck.CheckPrefix)
                {
                    return BadRequest("Prefix is already existed. Please enter a different prefix");
                }
                else if(newCategory == null)
                {
                    return BadRequest();
                }    
                else
                {
                    return Ok(newCategory);
                }
            }
            return BadRequest();
        }
    }
}
