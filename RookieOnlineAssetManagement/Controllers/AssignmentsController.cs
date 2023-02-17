using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RookieOnlineAssetManagement.Entities;
using RookieOnlineAssetManagement.Interface;
using RookieOnlineAssetManagement.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AssignmentsController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IAssignmentRepository _assignmentRepository;

        public AssignmentsController(IAssignmentRepository assignmentRepository, UserManager<User> userManager)
        {
            _userManager = userManager;
            _assignmentRepository = assignmentRepository;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult> GetAssignmentsOfUser(string fieldName, string sortType, int page, int limit)
        {
            var currUser = await _userManager.GetUserAsync(User);
            if (currUser != null)
            {
                var assignments = _assignmentRepository.GetAssignmentListOfUserById(currUser.Id, fieldName, sortType, page, limit);
                return Ok(assignments);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetAssignmentDetail(int id)
        {
            var assignment = await _assignmentRepository.GetAssignmentById(id);
            return Ok(assignment);
        }

        [HttpGet("[action]/{id}")]
        public async Task<ActionResult> AcceptAssignment(int id)
        {
            var assignment = await _assignmentRepository.AcceptAssignmentById(id);
            if (assignment != null)
            {
                return NoContent();
            }
            else
            {
                return NotFound("Invalid assignment id");
            }
        }

        [HttpGet("[action]/{id}")]
        public async Task<ActionResult> DeclineAssignment(int id)
        {
            var assignment = await _assignmentRepository.DisabledAssignmentById(id);
            if (assignment != null)
            {
                return NoContent();
            }
            else
            {
                return NotFound("Invalid assignment id");
            }
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<List<AssignmentDTO>>> GetAssignmentById(int id)
        {
            var assignment = await _assignmentRepository.GetAsync(id);
            return Ok(assignment);
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<AssignmentDTO>> CreateAssignment(CreateAssignmentModel assignment)
        {
            var assignor = await _userManager.GetUserAsync(User);
            var newAssignment = await _assignmentRepository.CreateAssignmentAsync(assignor, assignment);
            return CreatedAtAction(
                nameof(GetAssignmentById),
                new { id = newAssignment.Id },
                newAssignment);
        }

        [HttpPost("GetAssignmentNumberAfterFilter")]
        public async Task<ActionResult<int>> GetAssignmentNumberAfterFilter(AssignmentFilters filters)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            var assignmentsCount = await _assignmentRepository.CountAssignmentsAfterFilterAsync(filters, currentUser);
            return Ok(assignmentsCount);
        }

        [HttpPost("GetAssignmentsByFilters")]
        public async Task<ActionResult<List<AssignmentGetDTO>>> GetAssignmentsByFilters([FromQuery] PaginationParameters paginationParameters, AssignmentFilters filters)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            var validPaginationParameters = new PaginationParameters(paginationParameters.PageNumber, paginationParameters.PageSize);
            var assignmentList = await _assignmentRepository.GetAssignmentsByFiltersAsync(validPaginationParameters.PageNumber, validPaginationParameters.PageSize, filters, currentUser);
            return Ok(assignmentList);
        }
        [HttpGet("detailEdit/{id}")]
        public async Task<ActionResult> GetAssignmentDetailEdit(int id)
        {
            var assignment = await _assignmentRepository.GetAssignmentEditById(id);
            return Ok(assignment);
        }
        [HttpPut("editAssign/{assignmentId}")]
        public async Task<ActionResult<AssignmentDTO>> EditAssignment(int assignmentId, EditAssignmentModel assignment)
        {
            //var assignor = await _userManager.GetUserAsync(User);
            var newAssignment = await _assignmentRepository.EditAssignmentAsync(assignmentId, assignment);
            if (assignment == null)
            {
                return BadRequest("Assignment can not update!");
            }
            return Ok(assignment);
        }
        [HttpPut("[action]/{assignmentId}")]
        public async Task<ActionResult> DeleteAssignment(int assignmentId)
        {
            var assignment = await _assignmentRepository.DisabledAssignmentById(assignmentId);
            if (assignment != null)
            {
                return NoContent();
            }
            else
            {
                return NotFound("Invalid assignment id");
            }
        }
    }
}