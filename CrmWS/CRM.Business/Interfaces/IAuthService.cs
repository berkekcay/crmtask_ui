using CRM.Core.Models;

namespace CRM.Business.Interfaces
{
    public interface IAuthService
    {
        Task<string> LoginAsync(string email, string password);
        Task<User> RegisterAsync(User user, string password);
        Task<string> GenerateJwtTokenAsync(User user);
        Task<bool> ValidatePasswordAsync(User user, string password);
        Task<User?> GetCurrentUserAsync(string email);
        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        Task<string> GenerateRefreshTokenAsync();
        Task<string?> RefreshTokenAsync(string token, string refreshToken);
    }
}