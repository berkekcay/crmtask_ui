using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using CRM.Core.Models;
using CRM.Core.Interfaces;
using CRM.Business.Interfaces;

namespace CRM.Business.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<string> LoginAsync(string email, string password)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("Account is deactivated");
            }

            user.LastLoginAt = DateTime.Now;
            await _userRepository.UpdateAsync(user);

            return await GenerateJwtTokenAsync(user);
        }

        public async Task<User> RegisterAsync(User user, string password)
        {
            if (await _userRepository.EmailExistsAsync(user.Email))
            {
                throw new InvalidOperationException("Email already exists");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            user.CreatedAt = DateTime.Now;

            return await _userRepository.AddAsync(user);
        }

        public async Task<string> GenerateJwtTokenAsync(User user)
        {
            var userWithRoles = await _userRepository.GetWithRolesAsync(user.Id);

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new(ClaimTypes.Email, user.Email)
            };

            // Add roles to claims
            if (userWithRoles?.UserRoles != null)
            {
                foreach (var userRole in userWithRoles.UserRoles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, userRole.Role.Name));

                    // Add permissions to claims
                    foreach (var rolePermission in userRole.Role.RolePermissions)
                    {
                        claims.Add(new Claim("permission", rolePermission.Permission.Name));
                    }
                }
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(double.Parse(_configuration["Jwt:ExpiryInHours"]!)),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<bool> ValidatePasswordAsync(User user, string password)
        {
            return await System.Threading.Tasks.Task.FromResult(BCrypt.Net.BCrypt.Verify(password, user.PasswordHash));
        }

        public async Task<User?> GetCurrentUserAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }

        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null || !BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            {
                return false;
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.UpdatedAt = DateTime.Now;

            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<string> GenerateRefreshTokenAsync()
        {
            return await System.Threading.Tasks.Task.FromResult(Guid.NewGuid().ToString());
        }

        public async Task<string?> RefreshTokenAsync(string token, string refreshToken)
        {
            // Implement refresh token logic here
            await System.Threading.Tasks.Task.CompletedTask;
            return null;
        }
    }
}