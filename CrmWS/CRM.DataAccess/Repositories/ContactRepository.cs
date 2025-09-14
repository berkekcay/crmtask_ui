using Microsoft.EntityFrameworkCore;
using CRM.Core.Models;
using CRM.Core.Interfaces;

namespace CRM.DataAccess.Repositories
{
    public class ContactRepository : GenericRepository<Contact>, IContactRepository
    {
        public ContactRepository(CrmDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Contact>> GetByCompanyAsync(int companyId)
        {
            return await _dbSet
                .Include(c => c.Company)
                .Where(c => c.CompanyId == companyId && !c.IsDeleted)
                .ToListAsync();
        }

        public async Task<Contact?> GetPrimaryContactAsync(int companyId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(c => c.CompanyId == companyId && c.IsPrimaryContact && !c.IsDeleted);
        }

        public async Task<IEnumerable<Contact>> SearchByNameAsync(string name)
        {
            return await _dbSet
                .Include(c => c.Company)
                .Where(c => (c.FirstName + " " + c.LastName).Contains(name) && !c.IsDeleted)
                .ToListAsync();
        }

        public async Task<Contact?> GetByEmailAsync(string email)
        {
            return await _dbSet
                .Include(c => c.Company)
                .FirstOrDefaultAsync(c => c.Email == email && !c.IsDeleted);
        }

        public override async Task<IEnumerable<Contact>> GetAllAsync()
        {
            return await _dbSet
                .Include(c => c.Company)
                .Where(c => !c.IsDeleted)
                .ToListAsync();
        }
    }
}