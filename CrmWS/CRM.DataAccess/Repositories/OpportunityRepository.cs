using Microsoft.EntityFrameworkCore;
using CRM.Core.Models;
using CRM.Core.Interfaces;

namespace CRM.DataAccess.Repositories
{
    public class OpportunityRepository : GenericRepository<Opportunity>, IOpportunityRepository
    {
        public OpportunityRepository(CrmDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Opportunity>> GetByUserAsync(int userId)
        {
            return await _dbSet
                .Include(o => o.Company)
                .Include(o => o.Contact)
                .Include(o => o.Stage)
                .Include(o => o.AssignedUser)
                .Where(o => o.AssignedUserId == userId && !o.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<Opportunity>> GetByStageAsync(int stageId)
        {
            return await _dbSet
                .Include(o => o.Company)
                .Include(o => o.Contact)
                .Include(o => o.Stage)
                .Include(o => o.AssignedUser)
                .Where(o => o.StageId == stageId && !o.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<Opportunity>> GetByCompanyAsync(int companyId)
        {
            return await _dbSet
                .Include(o => o.Company)
                .Include(o => o.Contact)
                .Include(o => o.Stage)
                .Include(o => o.AssignedUser)
                .Where(o => o.CompanyId == companyId && !o.IsDeleted)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalValueByUserAsync(int userId)
        {
            return await _dbSet
                .Where(o => o.AssignedUserId == userId && !o.IsDeleted)
                .SumAsync(o => o.EstimatedValue);
        }

        public async Task<IEnumerable<Opportunity>> GetOpportunitiesWithDetailsAsync()
        {
            return await _dbSet
                .Include(o => o.Company)
                .Include(o => o.Contact)
                .Include(o => o.Stage)
                .Include(o => o.AssignedUser)
                .Where(o => !o.IsDeleted)
                .ToListAsync();
        }

        public override async Task<IEnumerable<Opportunity>> GetAllAsync()
        {
            return await GetOpportunitiesWithDetailsAsync();
        }
    }
}