using CRM.Core.Models;

namespace CRM.Business.Interfaces
{
    public interface IOpportunityService
    {
        Task<IEnumerable<Opportunity>> GetAllOpportunitiesAsync();
        Task<Opportunity?> GetOpportunityByIdAsync(int id);
        Task<IEnumerable<Opportunity>> GetOpportunitiesByUserAsync(int userId);
        Task<IEnumerable<Opportunity>> GetOpportunitiesByStageAsync(int stageId);
        Task<IEnumerable<Opportunity>> GetOpportunitiesByCompanyAsync(int companyId);
        Task<Opportunity> CreateOpportunityAsync(Opportunity opportunity);
        Task<Opportunity> UpdateOpportunityAsync(Opportunity opportunity);
        Task<bool> DeleteOpportunityAsync(int id);
        Task<bool> MoveOpportunityToStageAsync(int opportunityId, int stageId);
        Task<decimal> GetTotalValueByUserAsync(int userId);
        Task<IEnumerable<Opportunity>> GetPagedOpportunitiesAsync(int pageNumber, int pageSize);
        Task<Dictionary<string, decimal>> GetOpportunitiesByStageValueAsync();
    }
}

