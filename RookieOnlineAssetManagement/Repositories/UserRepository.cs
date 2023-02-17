using AutoMapper;
using Microsoft.AspNetCore.Identity;
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

namespace RookieOnlineAssetManagement.Repositories;
public class UserRepository : IUserRepository
{
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    public UserRepository(IMapper mapper, ApplicationDbContext context, UserManager<User> userManager)
    {
        _userManager = userManager;
        _mapper = mapper;
        _context = context;
    }

    public async Task<List<UserDTO>> GetAllAsync(User userLogin)
    {
        var users = await _context.Users.Where(s => s.IsDisabled == false && s.Location == userLogin.Location).OrderBy(s => s.StaffCode).ToListAsync();
        return _mapper.Map<List<UserDTO>>(users);
    }

    public async Task<UserDTO> CreateAsync(CreateUserDTO model, User user)
    {
        string[] splitFirstName = model.FirstName.Split(' ');
        string fullFirstName = "";
        foreach (string slice in splitFirstName)
            if (slice.Length > 0)
            {
                fullFirstName += slice.ToString().ToLower();
            }
        string[] splitlastname = model.LastName.Split(' ');
        string fullLastName = "";
        foreach (string slice in splitlastname)
            if (slice.Length > 0)
            {
                fullLastName += slice[0].ToString().ToLower();
            }
        var userName = fullFirstName + fullLastName;
        userName = Utilities.ChangeFormatName(userName);
        var duplicatename = await _context.Users.FirstOrDefaultAsync(p => p.UserName == userName);

        int count = 0;
        string newname = userName;
        while (duplicatename != null)
        {
            count++;
            newname = (userName + count.ToString());
            duplicatename = await _context.Users.FirstOrDefaultAsync(p => p.UserName == newname);
        }
        DateTime dateOfBirth = DateTime.Parse(model.DateofBirth.ToString());
        DateTime joinedDate = DateTime.Parse(model.JoinedDate.ToString());

        var staffCode = "SD0001";

        int total = await _context.Users.CountAsync();
        if (total >= 0)
        {
            total++;
            staffCode = "SD" + total.ToString().PadLeft(4, '0');
        }

        var newUser = new User
        {
            FirstName = model.FirstName,
            LastName = model.LastName,
            DateofBirth = dateOfBirth,
            Gender = model.Gender,
            JoinedDate = joinedDate,
            Type = model.Type,
            Location = user.Location,
            UserName = newname,
            StaffCode = staffCode,
            FirstLogin = true,
            IsDisabled = false
        };

        var defaultPassword = $"{newname}@{model.DateofBirth.ToString("ddMMyyyy")}";

        var result = await _userManager.CreateAsync(newUser, defaultPassword);

        var userDTO = _mapper.Map<UserDTO>(newUser);
        return userDTO;
    }

    public async Task<List<UserModel>> FindUser(string find, User userLogin, string type)
    {
        var allUsers = await _context.Users.Where(x => x.Location == userLogin.Location && x.IsDisabled == false).Select(x => new UserModel
        {
            Id = x.Id,
            StaffCode = x.StaffCode,
            FullName = x.FirstName + " " + x.LastName,
            UserName = x.UserName,
            JoinedDate = x.JoinedDate,
            DateofBirth = x.DateofBirth,
            Gender = x.Gender,
            Location = x.Location,
            Type = x.Type,
            isDisabled = x.IsDisabled
        }).ToListAsync();
        if (type == "Staff")
        {
            var users = allUsers.Where(s => s.StaffCode.Replace(" ", "").ToUpper().Contains(find.Replace(" ", "").ToUpper()) && s.Location == userLogin.Location && s.isDisabled == false && s.Type == UserType.Staff).OrderBy(o => o.StaffCode).ToList();
            if (users.Count == 0)
            {
                users = allUsers.Where(s => s.FullName.Replace(" ", "").ToUpper().Contains(find.Replace(" ", "").ToUpper()) && s.Location == userLogin.Location && s.isDisabled == false && s.Type == UserType.Staff).OrderBy(o => o.StaffCode).ToList();
            }
            return _mapper.Map<List<UserModel>>(users);
        }
        else if (type == "Admin")
        {
            var users = allUsers.Where(s => s.StaffCode.Replace(" ", "").ToUpper().Contains(find.Replace(" ", "").ToUpper()) && s.Location == userLogin.Location && s.isDisabled == false && s.Type == UserType.Admin).OrderBy(o => o.StaffCode).ToList();
            if (users.Count == 0)
            {
                users = allUsers.Where(s => (s.FullName.Replace(" ", "").ToUpper().ToUpper()).Contains(find.Replace(" ", "").ToUpper()) && s.Location == userLogin.Location && s.isDisabled == false && s.Type == UserType.Admin).OrderBy(o => o.StaffCode).ToList();
            }
            return _mapper.Map<List<UserModel>>(users);
        }
        else
        {
            var users = allUsers.Where(s => s.StaffCode.Replace(" ", "").ToUpper().Contains(find.Replace(" ", "").ToUpper()) && s.Location == userLogin.Location && s.isDisabled == false).OrderBy(o => o.StaffCode).ToList();
            if (users.Count == 0)
            {
                users = allUsers.Where(s => (s.FullName.Replace(" ", "").ToUpper()).Contains(find.Replace(" ", "").ToUpper()) && s.Location == userLogin.Location && s.isDisabled == false).OrderBy(o => o.StaffCode).ToList();
            }
            return _mapper.Map<List<UserModel>>(users);
        }
    }
    public async Task<List<UserModel>> GetAllAsync(int page, User userLogin)
    {
        var users = await _context.Users.Where(x => x.Location == userLogin.Location && x.IsDisabled == false).Select(x => new UserModel
        {
            Id = x.Id,
            StaffCode = x.StaffCode,
            FullName = x.FirstName + " " + x.LastName,
            UserName = x.UserName,
            JoinedDate = x.JoinedDate,
            DateofBirth = x.DateofBirth,
            Gender = x.Gender,
            Location = x.Location,
            Type = x.Type
        }).ToListAsync();
        int uCount = users.Count();
        int totalPages = (uCount % 5 == 0) ? uCount / 5 : (uCount / 5) + 1;
        int offset = 5 * (page - 1);
        var res = users.Skip(offset).Take(5).ToList();
        if (page == 0)
        {
            return _mapper.Map<List<UserModel>>(users);
        }
        else
        {
            return _mapper.Map<List<UserModel>>(res);
        }
    }

    public async Task<List<UserModel>> GetUserByType(int page, string type, User userLogin)
    {
        var users = await _context.Users.Where(x => x.Location == userLogin.Location && x.IsDisabled == false).Select(x => new UserModel
        {
            Id = x.Id,
            StaffCode = x.StaffCode,
            FullName = x.FirstName + " " + x.LastName,
            UserName = x.UserName,
            JoinedDate = x.JoinedDate,
            DateofBirth = x.DateofBirth,
            Gender = x.Gender,
            Location = x.Location,
            Type = x.Type,
            isDisabled = x.IsDisabled
        }).ToListAsync();
        if (type != "")
        {
            if (type == "Admin")
            {
                users = users.Where(x => x.Type == UserType.Admin && x.Location == userLogin.Location && x.isDisabled == false).ToList();
            }
            else if (type == "Staff")
            {
                users = users.Where(x => x.Type == UserType.Staff && x.Location == userLogin.Location && x.isDisabled == false).ToList();
            }
            else
            {
                users = users.Where(x => x.Location == userLogin.Location && x.isDisabled == false).ToList();
            }
        }
        else
        {
            users = users.Where(x => x.Location == userLogin.Location && x.isDisabled == false).ToList();
        }
        int uCount = users.Count();
        int totalPages = (uCount % 5 == 0) ? uCount / 5 : (uCount / 5) + 1;
        int offset = 5 * (page - 1);
        var res = users.Skip(offset).Take(5).ToList();
        if (page == 0)
        {
            return _mapper.Map<List<UserModel>>(users);
        }
        else
        {
            return _mapper.Map<List<UserModel>>(res);
        }
    }

    public async Task<List<UserModel>> SortUser(string sort, User userLogin, string type, string find, string sortBy)
    {
        var users = await _context.Users.Where(x => x.Location == userLogin.Location && x.IsDisabled == false).Select(x => new UserModel
        {
            Id = x.Id,
            StaffCode = x.StaffCode,
            FullName = x.FirstName + " " + x.LastName,
            UserName = x.UserName,
            JoinedDate = x.JoinedDate,
            DateofBirth = x.DateofBirth,
            Gender = x.Gender,
            Location = x.Location,
            Type = x.Type,
            isDisabled = x.IsDisabled
        }).ToListAsync();
        switch (sort)
        {
            case "Staff Code":
                if (type != "null" && find == "null")
                {
                    if (sortBy == "Descending")
                    {
                        users = GetUserByType(0, type, userLogin).Result.OrderByDescending(o => o.StaffCode).ToList();
                        break;
                    }
                    else
                    {
                        users = GetUserByType(0, type, userLogin).Result.OrderBy(o => o.StaffCode).ToList();
                        break;
                    }
                }
                else if (find != "null" && type == "null")
                {
                    if (sortBy == "Descending")
                    {
                        users = FindUser(find, userLogin, type).Result.OrderByDescending(o => o.StaffCode).ToList();
                        break;
                    }
                    else
                    {
                        users = FindUser(find, userLogin, type).Result.OrderBy(o => o.StaffCode).ToList();
                        break;
                    }
                }
                else
                {
                    if (sortBy == "Descending")
                    {
                        users = FindUser(find, userLogin, type).Result.OrderByDescending(o => o.StaffCode).ToList();
                        break;
                    }
                    else
                    {
                        users = FindUser(find, userLogin, type).Result.OrderBy(o => o.StaffCode).ToList();
                        break;
                    }
                }
            case "Full Name":
                if (type != "null" && find == "null")
                {
                    if (sortBy == "Descending")
                    {
                        users = GetUserByType(0, type, userLogin).Result.OrderByDescending(o => o.FullName).ToList();
                        break;
                    }
                    else
                    {
                        users = GetUserByType(0, type, userLogin).Result.OrderBy(o => o.FullName).ToList();
                        break;
                    }
                }
                else if (find != "null" && type == "null")
                {
                    if (sortBy == "Descending")
                    {
                        users = FindUser(find, userLogin, type).Result.OrderByDescending(o => o.FullName).ToList();
                        break;
                    }
                    else
                    {
                        users = FindUser(find, userLogin, type).Result.OrderBy(o => o.FullName).ToList();
                        break;
                    }
                }
                else
                {
                    if (sortBy == "Descending")
                    {
                        users = FindUser(find, userLogin, type).Result.OrderByDescending(o => o.FullName).ToList();
                        break;
                    }
                    else
                    {
                        users = FindUser(find, userLogin, type).Result.OrderBy(o => o.FullName).ToList();
                        break;
                    }
                }
            case "Joined Date":
                if (type != "null" && find == "null")
                {
                    if (sortBy == "Descending")
                    {
                        users = GetUserByType(0, type, userLogin).Result.OrderByDescending(o => o.JoinedDate).ToList();
                        break;
                    }
                    else
                    {
                        users = GetUserByType(0, type, userLogin).Result.OrderBy(o => o.JoinedDate).ToList();
                        break;
                    }
                }
                else if (find != "null" && type == "null")
                {
                    if (sortBy == "Descending")
                    {
                        users = FindUser(find, userLogin, type).Result.OrderByDescending(o => o.JoinedDate).ToList();
                        break;
                    }
                    else
                    {
                        users = FindUser(find, userLogin, type).Result.OrderBy(o => o.JoinedDate).ToList();
                        break;
                    }
                }
                else
                {
                    if (sortBy == "Descending")
                    {
                        users = FindUser(find, userLogin, type).Result.OrderByDescending(o => o.JoinedDate).ToList();
                        break;
                    }
                    else
                    {
                        users = FindUser(find, userLogin, type).Result.OrderBy(o => o.JoinedDate).ToList();
                        break;
                    }
                }
            case "Type":
                if (type != "null" && find == "null")
                {
                    if (sortBy == "Descending")
                    {
                        users = GetUserByType(0, type, userLogin).Result.OrderByDescending(o => o.Type).ToList();
                        break;
                    }
                    else
                    {
                        users = GetUserByType(0, type, userLogin).Result.OrderBy(o => o.Type).ToList();
                        break;
                    }
                }
                else if (find != "null" && type == "null")
                {
                    if (sortBy == "Descending")
                    {
                        users = FindUser(find, userLogin, type).Result.OrderByDescending(o => o.Type).ToList();
                        break;
                    }
                    else
                    {
                        users = FindUser(find, userLogin, type).Result.OrderBy(o => o.Type).ToList();
                        break;
                    }
                }
                else
                {
                    if (sortBy == "Descending")
                    {
                        users = FindUser(find, userLogin, type).Result.OrderByDescending(o => o.Type).ToList();
                        break;
                    }
                    else
                    {
                        users = FindUser(find, userLogin, type).Result.OrderBy(o => o.Type).ToList();
                        break;
                    }
                }
        }

        return _mapper.Map<List<UserModel>>(users);
    }

    public async Task<UserDTO> GetAsync(string staffCode)
    {
        var user = await _context.Users.Where(p => p.StaffCode == staffCode).FirstOrDefaultAsync();
        var userDTO = _mapper.Map<UserDTO>(user);
        return userDTO;
    }

    public async Task<UserEditDto> UpdateAsync(UserEditDto userDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.StaffCode == userDto.StaffCode);
        if (user != null)
        {
            int age = ((int)((DateTime.Now - userDto.DateofBirth).TotalDays / 365));
            if (age < 18 || age > 100)
            {
                return null;
            }

            if (userDto.Gender != Gender.Female && userDto.Gender != Gender.Male)
            {
                return null;
            }
            else
            {
                user.Gender = userDto.Gender;
            }
            if (userDto.Type != UserType.Admin && userDto.Type != UserType.Staff)
            {
                return null;
            }
            else
            {
                user.Type = userDto.Type;
            }

            user.DateofBirth = userDto.DateofBirth;
            user.JoinedDate = userDto.JoinedDate;

            _context.Users.Update(user);

            await _context.SaveChangesAsync();
            return userDto;
        }
        else
        {
            return null;
        }
    }

    public async Task AddLocation(string staffCode, string location)
    {
        var user = await _context.Users.FirstOrDefaultAsync((x) => x.StaffCode == staffCode);
        if (user != null)
        {
            user.Location = location;
            await _context.SaveChangesAsync();
        }
    }
    public async Task<int> CheckUserCanDeleteAsync(string staffCode)
    {
        var user = await _context.Users.Where(u => u.StaffCode == staffCode)
            .Include(a => a.AssignedToAssignments
                     .Where(d => d.IsDisabled == false))
            .FirstOrDefaultAsync();
        var countAssignment = user.AssignedToAssignments.Count();
        return countAssignment;
    }
    public async Task<User> DeleteUserAsync(string staffCode)
    {
        User user = _context.Users.Where(s => s.StaffCode == staffCode).FirstOrDefault();

        if (user != null)
        {
            user.IsDisabled = true;
            await _context.SaveChangesAsync();
        }

        return user;
    }

    public async Task<UserPagingModel> GetUsersAsync(SearchParameters parameters, string location)
    {
        var searchString = (parameters.SearchString == null) ? "" : parameters.SearchString;
        var userQuery = _userManager.Users
            .Where(x => x.Location == location && x.IsDisabled == false &&
                (x.StaffCode.Contains(searchString) || (x.FirstName + " " + x.LastName).Contains(searchString))
            );
        var userCount = userQuery.Count();
        if (parameters.SortType)
        {
            switch (parameters.SortBy)
            {
                case "FullName":
                    userQuery = userQuery.OrderBy(on => (on.FirstName + " " + on.LastName).ToLower());
                    break;
                case "Type":
                    userQuery = userQuery.OrderBy(on => on.Type);
                    break;
                default:
                    userQuery = userQuery.OrderBy(on => on.StaffCode);
                    break;
            }
        }
        else
        {
            switch (parameters.SortBy)
            {
                case "FullName":
                    userQuery = userQuery.OrderByDescending(on => (on.FirstName + " " + on.LastName).ToLower());
                    break;
                case "Type":
                    userQuery = userQuery.OrderByDescending(on => on.Type);
                    break;
                default:
                    userQuery = userQuery.OrderByDescending(on => on.StaffCode);
                    break;
            }
        }
        var users = await userQuery
            .Skip((parameters.PageNumber - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .ToListAsync();
        var usersDTO = _mapper.Map<List<UserDTO>>(users);
        return new UserPagingModel
        {
            Total = userCount,
            Users = usersDTO,
        };
    }
}