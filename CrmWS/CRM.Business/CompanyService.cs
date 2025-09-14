using CRM.Core.Models;
using CRM.Core.Interfaces;
using CRM.Business.Interfaces;

namespace CRM.Business.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _companyRepository;

        public CompanyService(ICompanyRepository companyRepository)
        {
            _companyRepository = companyRepository;
        }

        public async Task<IEnumerable<Company>> GetAllCompaniesAsync()
        {
            return await _companyRepository.GetAllAsync();
        }

        public async Task<Company?> GetCompanyByIdAsync(int id)
        {
            return await _companyRepository.GetByIdAsync(id);
        }

        public async Task<Company?> GetCompanyWithContactsAsync(int id)
        {
            return await _companyRepository.GetWithContactsAsync(id);
        }

        public async Task<Company> CreateCompanyAsync(Company company)
        {
            company.CreatedAt = DateTime.Now;
            return await _companyRepository.AddAsync(company);
        }

        public async Task<Company> UpdateCompanyAsync(Company company)
        {
            var existingCompany = await _companyRepository.GetByIdAsync(company.Id);
            if (existingCompany == null)
            {
                throw new KeyNotFoundException("Company not found");
            }

            company.UpdatedAt = DateTime.Now;
            return await _companyRepository.UpdateAsync(company);
        }

        public async Task<bool> DeleteCompanyAsync(int id)
        {
            var company = await _companyRepository.GetByIdAsync(id);
            if (company == null) return false;

            company.IsDeleted = true;
            company.UpdatedAt = DateTime.Now;
            await _companyRepository.UpdateAsync(company);
            return true;
        }

        public async Task<IEnumerable<Company>> SearchCompaniesByNameAsync(string name)
        {
            return await _companyRepository.SearchByNameAsync(name);
        }

        public async Task<IEnumerable<Company>> GetCompaniesByIndustryAsync(string industry)
        {
            return await _companyRepository.GetByIndustryAsync(industry);
        }

        public async Task<IEnumerable<Company>> GetPagedCompaniesAsync(int pageNumber, int pageSize)
        {
            return await _companyRepository.GetPagedAsync(pageNumber, pageSize);
        }

        public async Task<int> GetTotalCompanyCountAsync()
        {
            return await _companyRepository.CountAsync();
        }
    }
}