using Microsoft.AspNetCore.Mvc;
using CRM.Business.Interfaces;
using CRM.Core.Models;

namespace CRM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.LoginAsync(request.Email, request.Password);
            return Ok(token);
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] RegisterRequest request)
        {
            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email
            };

            var createdUser = await _authService.RegisterAsync(user, request.Password);
            return Ok(createdUser);
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var result = await _authService.ChangePasswordAsync(request.UserId, request.CurrentPassword, request.NewPassword);
            if (!result) return BadRequest();
            return NoContent();
        }

        public record LoginRequest(string Email, string Password);
        public record RegisterRequest(string FirstName, string LastName, string Email, string Password);
        public record ChangePasswordRequest(int UserId, string CurrentPassword, string NewPassword);
    }
}
