using CRM.Core.Models;
using CRM.Core.Interfaces;
using CRM.Business.Interfaces;

namespace CRM.Business.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            if (await _userRepository.EmailExistsAsync(user.Email))
            {
                throw new InvalidOperationException("Email already exists");
            }

            user.CreatedAt = DateTime.Now;
            return await _userRepository.AddAsync(user);
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            var existingUser = await _userRepository.GetByIdAsync(user.Id);
            if (existingUser == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            user.UpdatedAt = DateTime.Now;
            return await _userRepository.UpdateAsync(user);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            user.IsDeleted = true;
            user.UpdatedAt = DateTime.Now;
            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _userRepository.EmailExistsAsync(email);
        }

        public async Task<User?> GetUserWithRolesAsync(int userId)
        {
            return await _userRepository.GetWithRolesAsync(userId);
        }

        public async Task<IEnumerable<User>> GetUsersByRoleAsync(string roleName)
        {
            return await _userRepository.GetByRoleAsync(roleName);
        }

        public async Task<bool> AssignRoleToUserAsync(int userId, int roleId)
        {
            // Implementation would require UserRoleRepository
            await System.Threading.Tasks.Task.CompletedTask;
            return true;
        }

        public async Task<bool> RemoveRoleFromUserAsync(int userId, int roleId)
        {
            // Implementation would require UserRoleRepository
            await System.Threading.Tasks.Task.CompletedTask;
            return true;
        }

        public async Task<IEnumerable<User>> GetPagedUsersAsync(int pageNumber, int pageSize)
        {
            return await _userRepository.GetPagedAsync(pageNumber, pageSize);
        }
    }
}