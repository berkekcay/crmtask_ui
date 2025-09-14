using Microsoft.EntityFrameworkCore;
using CRM.Core.Interfaces;
using CRM.Core.Models;
using TaskStatus = CRM.Core.Models.TaskStatus;

namespace CRM.DataAccess.Repositories
{
    public class CrmTaskRepository : GenericRepository<CrmTask>, ICrmTaskRepository
    {
        public CrmTaskRepository(CrmDbContext context) : base(context)
        {
        }
        
        public async System.Threading.Tasks.Task<IEnumerable<CrmTask>> GetByUserAsync(int userId)
        {
            return await _dbSet
                .Include(t => t.AssignedUser)
                .Include(t => t.Company)
                .Include(t => t.Contact)
                .Include(t => t.Opportunity)
                .Where(t => t.AssignedUserId == userId && !t.IsDeleted)
                .ToListAsync();
        }

        public async System.Threading.Tasks.Task<IEnumerable<CrmTask>> GetByStatusAsync(TaskStatus status)
        {
            return await _dbSet
                .Include(t => t.AssignedUser)
                .Include(t => t.Company)
                .Include(t => t.Contact)
                .Where(t => t.Status == status && !t.IsDeleted)
                .ToListAsync();
        }

        public async System.Threading.Tasks.Task<IEnumerable<CrmTask>> GetOverdueTasksAsync()
        {
            return await _dbSet
                .Include(t => t.AssignedUser)
                .Include(t => t.Company)
                .Include(t => t.Contact)
                .Where(t => t.DueDate < DateTime.Now &&
                           t.Status != TaskStatus.Completed &&
                           !t.IsDeleted)
                .ToListAsync();
        }

        public async System.Threading.Tasks.Task<IEnumerable<CrmTask>> GetTasksDueTodayAsync()
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            return await _dbSet
                .Include(t => t.AssignedUser)
                .Include(t => t.Company)
                .Include(t => t.Contact)
                .Where(t => t.DueDate >= today &&
                           t.DueDate < tomorrow &&
                           t.Status != TaskStatus.Completed &&
                           !t.IsDeleted)
                .ToListAsync();
        }

        public async System.Threading.Tasks.Task<CrmTask?> GetWithCommentsAsync(int taskId)
        {
            return await _dbSet
                .Include(t => t.Comments)
                .ThenInclude(c => c.User)
                .Include(t => t.AssignedUser)
                .Include(t => t.Company)
                .Include(t => t.Contact)
                .Include(t => t.Opportunity)
                .FirstOrDefaultAsync(t => t.Id == taskId && !t.IsDeleted);
        }

        public override async System.Threading.Tasks.Task<IEnumerable<CrmTask>> GetAllAsync()
        {
            return await _dbSet
                .Include(t => t.AssignedUser)
                .Include(t => t.Company)
                .Include(t => t.Contact)
                .Include(t => t.Opportunity)
                .Where(t => !t.IsDeleted)
                .ToListAsync();
        }
    }
}
