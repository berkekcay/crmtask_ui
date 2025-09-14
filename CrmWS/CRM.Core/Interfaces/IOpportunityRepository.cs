using CRM.Core.Models;

namespace CRM.Core.Interfaces
{
    public interface IOpportunityRepository : IGenericRepository<Opportunity>
    {
        Task<IEnumerable<Opportunity>> GetByUserAsync(int userId);
        Task<IEnumerable<Opportunity>> GetByStageAsync(int stageId);
        Task<IEnumerable<Opportunity>> GetByCompanyAsync(int companyId);
        Task<decimal> GetTotalValueByUserAsync(int userId);
        Task<IEnumerable<Opportunity>> GetOpportunitiesWithDetailsAsync();
    }
}