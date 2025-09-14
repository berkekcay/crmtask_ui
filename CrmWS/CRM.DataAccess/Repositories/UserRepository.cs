using Microsoft.EntityFrameworkCore;
using CRM.Core.Models;
using CRM.Core.Interfaces;

namespace CRM.DataAccess.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(CrmDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet
                .FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);
        }

        public async Task<User?> GetWithRolesAsync(int userId)
        {
            return await _dbSet
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .ThenInclude(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
                .FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);
        }

        public async Task<IEnumerable<User>> GetByRoleAsync(string roleName)
        {
            return await _dbSet
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .Where(u => u.UserRoles.Any(ur => ur.Role.Name == roleName) && !u.IsDeleted)
                .ToListAsync();
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _dbSet.AnyAsync(u => u.Email == email && !u.IsDeleted);
        }

        public override async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _dbSet
                .Where(u => !u.IsDeleted)
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .ToListAsync();
        }
    }
}