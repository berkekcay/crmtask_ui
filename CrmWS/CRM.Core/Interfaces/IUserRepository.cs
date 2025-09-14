using CRM.Core.Models;

namespace CRM.Core.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetWithRolesAsync(int userId);
        Task<IEnumerable<User>> GetByRoleAsync(string roleName);
        Task<bool> EmailExistsAsync(string email);
    }
}