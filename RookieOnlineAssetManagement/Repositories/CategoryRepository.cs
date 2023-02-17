using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Enum;
using RookieOnlineAssetManagement.Helpper;
using RookieOnlineAssetManagement.Interface;
using RookieOnlineAssetManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Repositories
{
    public class CategoryRepository:ICategoryRepository
    {
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public CategoryRepository(IMapper mapper, ApplicationDbContext context, UserManager<User> userManager)
        {
            _userManager = userManager;
            _mapper = mapper;
            _context = context;
        }

        public async Task<List<CategoryModel>> GetListCategory()
        {
            var categoryList = await _context.Categories.Select(x => new CategoryModel
            {
                Id = x.Id,
                CategoryName = x.Name
            }).ToListAsync();
            return _mapper.Map<List<CategoryModel>>(categoryList);
        }

        public async Task<List<CategoryDTO>> GetAllAsync()
        {
            List<Category> categories = await _context.Categories.Where(c => !c.IsDisabled).ToListAsync();
            var categoryGetAll = _mapper.Map<List<CategoryDTO>>(categories);
            return categoryGetAll;
        }
        public async Task<CategoryDTO> CategoryCreateAsync(CategoryDTO categoryDTO)
        {
            if (categoryDTO.Name.Length == 1)
            {
                categoryDTO.Name = categoryDTO.Name.Trim();
            }
            else
            {
                categoryDTO.Name = Utilities.OptimizeSpace(categoryDTO.Name);
            }
            Category category = await _context.Categories.FirstOrDefaultAsync(c => c.Name.ToLower() == categoryDTO.Name.ToLower()
                                                                                          || c.Prefix.ToLower() == categoryDTO.Prefix.ToLower());
            if (category != null)
            {
                if (category.Name.ToLower() == categoryDTO.Name.ToLower())
                {
                    categoryDTO.CategoryCheck = CategotyCheck.CheckName;
                    return categoryDTO;
                }
                else
                {
                    categoryDTO.CategoryCheck = CategotyCheck.CheckPrefix;
                    return categoryDTO;
                }
            }
            try
            {
                categoryDTO.Prefix = categoryDTO.Prefix.ToUpper();
                Category newCategory = _mapper.Map<Category>(categoryDTO);
                await _context.Categories.AddAsync(newCategory);
                await _context.SaveChangesAsync();
                return categoryDTO;
            }
            catch { return null; }
        }
    }
}
