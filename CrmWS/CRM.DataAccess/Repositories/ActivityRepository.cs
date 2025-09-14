using Microsoft.EntityFrameworkCore;
using CRM.Core.Models;
using CRM.Core.Interfaces;

namespace CRM.DataAccess.Repositories
{
    public class ActivityRepository : GenericRepository<Activity>, IActivityRepository
    {
        public ActivityRepository(CrmDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Activity>> GetByUserAsync(int userId)
        {
            return await _dbSet
                .Include(a => a.User)
                .Include(a => a.Company)
                .Include(a => a.Contact)
                .Include(a => a.Opportunity)
                .Where(a => a.UserId == userId && !a.IsDeleted)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Activity>> GetByCompanyAsync(int companyId)
        {
            return await _dbSet
                .Include(a => a.User)
                .Include(a => a.Company)
                .Include(a => a.Contact)
                .Include(a => a.Opportunity)
                .Where(a => a.CompanyId == companyId && !a.IsDeleted)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Activity>> GetByContactAsync(int contactId)
        {
            return await _dbSet
                .Include(a => a.User)
                .Include(a => a.Company)
                .Include(a => a.Contact)
                .Include(a => a.Opportunity)
                .Where(a => a.ContactId == contactId && !a.IsDeleted)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Activity>> GetByOpportunityAsync(int opportunityId)
        {
            return await _dbSet
                .Include(a => a.User)
                .Include(a => a.Company)
                .Include(a => a.Contact)
                .Include(a => a.Opportunity)
                .Where(a => a.OpportunityId == opportunityId && !a.IsDeleted)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Activity>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Include(a => a.User)
                .Include(a => a.Company)
                .Include(a => a.Contact)
                .Include(a => a.Opportunity)
                .Where(a => a.ScheduledAt >= startDate &&
                           a.ScheduledAt <= endDate &&
                           !a.IsDeleted)
                .OrderBy(a => a.ScheduledAt)
                .ToListAsync();
        }

        public override async Task<IEnumerable<Activity>> GetAllAsync()
        {
            return await _dbSet
                .Include(a => a.User)
                .Include(a => a.Company)
                .Include(a => a.Contact)
                .Include(a => a.Opportunity)
                .Where(a => !a.IsDeleted)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }
    }
}