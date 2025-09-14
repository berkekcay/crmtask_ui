using Microsoft.EntityFrameworkCore;
using CRM.Core.Models;
using CRM.Core.Interfaces;

namespace CRM.DataAccess.Repositories
{
    public class CompanyRepository : GenericRepository<Company>, ICompanyRepository
    {
        public CompanyRepository(CrmDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Company>> GetWithContactsAsync()
        {
            return await _dbSet
                .Include(c => c.Contacts)
                .Where(c => !c.IsDeleted)
                .ToListAsync();
        }

        public async Task<Company?> GetWithContactsAsync(int companyId)
        {
            return await _dbSet
                .Include(c => c.Contacts)
                .Include(c => c.Opportunities)
                .FirstOrDefaultAsync(c => c.Id == companyId && !c.IsDeleted);
        }

        public async Task<IEnumerable<Company>> SearchByNameAsync(string name)
        {
            return await _dbSet
                .Where(c => c.Name.Contains(name) && !c.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<Company>> GetByIndustryAsync(string industry)
        {
            return await _dbSet
                .Where(c => c.Industry == industry && !c.IsDeleted)
                .ToListAsync();
        }

        public override async Task<IEnumerable<Company>> GetAllAsync()
        {
            return await _dbSet
                .Where(c => !c.IsDeleted)
                .ToListAsync();
        }
    }
}