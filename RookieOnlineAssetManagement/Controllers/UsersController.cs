using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Interface;
using RookieOnlineAssetManagement.Models;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IUserRepository _userRepository;

        public UsersController(UserManager<User> userManager, SignInManager<User> signInManager, IUserRepository userRepository)
        {
            _userManager = userManager;
            _userRepository = userRepository;
            _signInManager = signInManager;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<UserPagingModel>> GetUsers([FromQuery] SearchParameters parameters)
        {
            var assignor = await _userManager.GetUserAsync(User);
            var result = await _userRepository.GetUsersAsync(parameters, assignor.Location);
            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<User>> Get()
        {
            var currUser = await _userManager.GetUserAsync(User);
            return Ok(currUser);
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<List<UserDTO>>> GetAll()
        {
            var currUser = await _userManager.GetUserAsync(User);
            var userList = await _userRepository.GetAllAsync(currUser);
            if (userList != null)
            {
                return Ok(userList);
            }
            return NotFound();
        }

        [HttpPost("FirstChangePassword")]
        public async Task<ActionResult> FirstChangePassword(ChangePasswordModel changePasswordModel)
        {
            var user = await _userManager.GetUserAsync(User);
            string pattern = @"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^\._-])(?!.*\s).{8,}$";
            if (!Regex.IsMatch(changePasswordModel.NewPassword, pattern))
            {
                return BadRequest("Password must Contain 8 Characters, include atleast one uppercase, one lowercase, one number and one special case character");
            };
            if (user != null)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var changePasswordResult = await _userManager.ResetPasswordAsync(user, token, changePasswordModel.NewPassword);
                if (changePasswordResult.Succeeded)
                {
                    user.FirstLogin = false;
                    var setFirstLoginResult = await _userManager.UpdateAsync(user);
                    if (setFirstLoginResult.Succeeded)
                        return Ok("Your password has been changed successfully!");
                }
            }
            return BadRequest("Something went wrong.");
        }


        [HttpPost("ChangePassword")]
        public async Task<ActionResult> ChangePassword(ChangePasswordModel changePasswordModel)
        {
            // Get user current login
            var user = await _userManager.GetUserAsync(User);

            if (user != null)
            {
                // Check compare old password vs new password
                if (changePasswordModel.OldPassword != changePasswordModel.NewPassword)
                {
                    // Check valid old password
                    bool isValidPassword = await _userManager.CheckPasswordAsync(user, changePasswordModel.OldPassword);
                    if (isValidPassword)
                    {

                        string pattern = @"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^\._-])(?!.*\s).{8,}$";
                        if (Regex.IsMatch(changePasswordModel.NewPassword, pattern))
                        {
                            var changePasswordResult = await _userManager.ChangePasswordAsync(user, changePasswordModel.OldPassword, changePasswordModel.NewPassword);
                            if (changePasswordResult.Succeeded)
                                return Ok("Your password has been changed successfully!");
                        }
                        else
                            return BadRequest("Password must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character");

                    }

                    else
                        return BadRequest("Password is incorrect");
                }
                else
                    return BadRequest("New password can't be match old password");
            }

            return BadRequest("Invalid User Login");
        }

        [HttpGet("Logout")]
        public async Task<ActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<ActionResult> CreateUser(CreateUserDTO model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.GetUserAsync(User);
                DateTime dateOfBirth = DateTime.Parse(model.DateofBirth.ToString());
                DateTime today = DateTime.Today;
                if (today < dateOfBirth.AddYears(18))
                {
                    return BadRequest("User is under 18. Please select a different date");
                }
                DateTime joinedDate = DateTime.Parse(model.JoinedDate.ToString());
                if (joinedDate < dateOfBirth)
                {
                    return BadRequest("Joined date is not later than Date of Birth.Please select a different date");
                }
                if (model.Gender is not Enum.Gender.Female and not Enum.Gender.Male)
                {
                    return BadRequest("Please choose gender");
                }

                if (model.Type is not Enum.UserType.Admin and not Enum.UserType.Staff)
                {
                    return BadRequest("Please choose Type");
                }
                if (joinedDate.DayOfWeek == DayOfWeek.Saturday || joinedDate.DayOfWeek == DayOfWeek.Sunday)
                {
                    return BadRequest("Joined date is Saturday or Sunday. Please select a different date");
                }
                UserDTO newUser = await _userRepository.CreateAsync(model, user);

                return Ok(newUser);
            }
            return BadRequest();
        }

        [HttpGet("Pagination/{page}/{type}/{find}/{sort}/{sortBy}")]
        public async Task<ActionResult<IEnumerable<UserModel>>> GetUserByType(int page = 0, string type = "", string find = "", string sort = "", string sortBy = "Ascending")
        {
            var userLogin = await _userManager.GetUserAsync(User);
            var list = await _userRepository.GetAllAsync(page, userLogin);
            if (type != "null" && sort == "null" && find == "null")
            {
                list = await _userRepository.GetUserByType(page, type, userLogin);
            }
            else if (find != "null" && sort == "null" && type == "null")
            {
                list = await _userRepository.FindUser(find, userLogin, type);
            }
            else if (find != "null" && type != "null" && sort == "null")
            {
                list = await _userRepository.FindUser(find, userLogin, type);
            }
            else if (sort != "null")
            {
                list = await _userRepository.SortUser(sort, userLogin, type, find, sortBy);
            }
            return list;
        }

        [HttpGet("{staffcode}")]
        public async Task<ActionResult<UserDTO>> GetById(string staffCode)
        {
            var user = await _userRepository.GetAsync(staffCode);
            if (user == null)
            {
                return BadRequest("Can not find the user");
            }
            return Ok(user);
        }

        [HttpPut("[action]")]
        public async Task<ActionResult<UserDTO>> EditUser(UserEditDto userDto)
        {
            var user = await _userRepository.UpdateAsync(userDto);
            if (user == null)
                return BadRequest("User not found!");
            return Ok(user);
        }

        [HttpGet("checkuser/{staffCode}")]
        public async Task<ActionResult> CheckUserCanDelete(string staffCode)
        {
            var assignment = await _userRepository.CheckUserCanDeleteAsync(staffCode);
            if (assignment == 0)
            {
                return Ok("Can delete user");
            }
            else
            {
                return BadRequest(assignment);
            }
        }

        [HttpPut("delete/{staffCode}")]
        public async Task<IActionResult> DeleteUser(string staffCode)
        {
            var user = await _userRepository.DeleteUserAsync(staffCode);
            if (user != null)
            {
                return Ok(user);
            }
            else
            {
                return BadRequest("Don't find user");
            }
        }
    }
}