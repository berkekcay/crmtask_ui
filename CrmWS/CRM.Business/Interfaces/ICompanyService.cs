using CRM.Core.Models;

namespace CRM.Business.Interfaces
{
    public interface ICompanyService
    {
        Task<IEnumerable<Company>> GetAllCompaniesAsync();
        Task<Company?> GetCompanyByIdAsync(int id);
        Task<Company?> GetCompanyWithContactsAsync(int id);
        Task<Company> CreateCompanyAsync(Company company);
        Task<Company> UpdateCompanyAsync(Company company);
        Task<bool> DeleteCompanyAsync(int id);
        Task<IEnumerable<Company>> SearchCompaniesByNameAsync(string name);
        Task<IEnumerable<Company>> GetCompaniesByIndustryAsync(string industry);
        Task<IEnumerable<Company>> GetPagedCompaniesAsync(int pageNumber, int pageSize);
        Task<int> GetTotalCompanyCountAsync();
    }
}