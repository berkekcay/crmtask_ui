using CRM.Core.Models;

namespace CRM.Business.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> CreateUserAsync(User user);
        Task<User> UpdateUserAsync(User user);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> EmailExistsAsync(string email);
        Task<User?> GetUserWithRolesAsync(int userId);
        Task<IEnumerable<User>> GetUsersByRoleAsync(string roleName);
        Task<bool> AssignRoleToUserAsync(int userId, int roleId);
        Task<bool> RemoveRoleFromUserAsync(int userId, int roleId);
        Task<IEnumerable<User>> GetPagedUsersAsync(int pageNumber, int pageSize);
    }
}