using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Interface;
using RookieOnlineAssetManagement.Models;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ReturningRequestsController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IReturningRequestRepository _requestReturningRepository;
        public ReturningRequestsController(IReturningRequestRepository requestReturningRepository, UserManager<User> userManager)
        {
            _userManager = userManager;
            _requestReturningRepository = requestReturningRepository;
        }
        [HttpPost("[action]/{assignmentId}")]
        public async Task<ActionResult<ReturningRequestCreateModel>> CreateReturningRequest(int assignmentId)
        {
            var userLogin = await _userManager.GetUserAsync(User);
            var newRequest = await _requestReturningRepository.CreateReturningRequest(assignmentId, userLogin);
            return Ok(newRequest);
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<ReturningRequestPagingModel>> GetReturningRequests([FromQuery] ReturningRequestParameters parameters)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            var result = await _requestReturningRepository.GetReturningRequestsAsync(parameters, currentUser.Location);
            return Ok(result);
        }
        [HttpPut("[action]/{id}")]
        public async Task<ActionResult<ReturningRequestDTO>> CompleteReturningRequest(int id)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            var returningRequest = await _requestReturningRepository.CompleteReturningRequest(id,currentUser);
            if(returningRequest!=null)
            {
                return Ok(returningRequest);
            }
            else
            {
                return BadRequest("Not Found Returning Request");
            }
        }

        [HttpPut("[action]/{requestId}")]
        public async Task<ActionResult> CancelReturningRequest(int requestId)
        {
            var result = await _requestReturningRepository.DisabledReturningRequestById(requestId);
            if (result)
            {
                return Ok("Canceled successfully.");
            }
            return BadRequest("Not found returning request.");
        }
    }
}
