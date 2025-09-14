using CRM.Core.Models;

namespace CRM.Core.Interfaces
{
    public interface IContactRepository : IGenericRepository<Contact>
    {
        Task<IEnumerable<Contact>> GetByCompanyAsync(int companyId);
        Task<Contact?> GetPrimaryContactAsync(int companyId);
        Task<IEnumerable<Contact>> SearchByNameAsync(string name);
        Task<Contact?> GetByEmailAsync(string email);
    }
}