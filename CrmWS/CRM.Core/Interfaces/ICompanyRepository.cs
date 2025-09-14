using CRM.Core.Models;

namespace CRM.Core.Interfaces
{
    public interface ICompanyRepository : IGenericRepository<Company>
    {
        Task<IEnumerable<Company>> GetWithContactsAsync();
        Task<Company?> GetWithContactsAsync(int companyId);
        Task<IEnumerable<Company>> SearchByNameAsync(string name);
        Task<IEnumerable<Company>> GetByIndustryAsync(string industry);
    }
}