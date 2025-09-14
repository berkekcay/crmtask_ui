using CRM.Core.Models;
using CRM.Core.Interfaces;
using CRM.Business.Interfaces;

namespace CRM.Business.Services
{
    public class OpportunityService : IOpportunityService
    {
        private readonly IOpportunityRepository _opportunityRepository;

        public OpportunityService(IOpportunityRepository opportunityRepository)
        {
            _opportunityRepository = opportunityRepository;
        }

        public async Task<IEnumerable<Opportunity>> GetAllOpportunitiesAsync()
        {
            return await _opportunityRepository.GetAllAsync();
        }

        public async Task<Opportunity?> GetOpportunityByIdAsync(int id)
        {
            return await _opportunityRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Opportunity>> GetOpportunitiesByUserAsync(int userId)
        {
            return await _opportunityRepository.GetByUserAsync(userId);
        }

        public async Task<IEnumerable<Opportunity>> GetOpportunitiesByStageAsync(int stageId)
        {
            return await _opportunityRepository.GetByStageAsync(stageId);
        }

        public async Task<IEnumerable<Opportunity>> GetOpportunitiesByCompanyAsync(int companyId)
        {
            return await _opportunityRepository.GetByCompanyAsync(companyId);
        }

        public async Task<Opportunity> CreateOpportunityAsync(Opportunity opportunity)
        {
            opportunity.CreatedAt = DateTime.Now;
            return await _opportunityRepository.AddAsync(opportunity);
        }

        public async Task<Opportunity> UpdateOpportunityAsync(Opportunity opportunity)
        {
            var existingOpportunity = await _opportunityRepository.GetByIdAsync(opportunity.Id);
            if (existingOpportunity == null)
            {
                throw new KeyNotFoundException("Opportunity not found");
            }

            opportunity.UpdatedAt = DateTime.Now;
            return await _opportunityRepository.UpdateAsync(opportunity);
        }

        public async Task<bool> DeleteOpportunityAsync(int id)
        {
            var opportunity = await _opportunityRepository.GetByIdAsync(id);
            if (opportunity == null) return false;

            opportunity.IsDeleted = true;
            opportunity.UpdatedAt = DateTime.Now;
            await _opportunityRepository.UpdateAsync(opportunity);
            return true;
        }

        public async Task<bool> MoveOpportunityToStageAsync(int opportunityId, int stageId)
        {
            var opportunity = await _opportunityRepository.GetByIdAsync(opportunityId);
            if (opportunity == null) return false;

            opportunity.StageId = stageId;
            opportunity.UpdatedAt = DateTime.Now;

            await _opportunityRepository.UpdateAsync(opportunity);
            return true;
        }

        public async Task<decimal> GetTotalValueByUserAsync(int userId)
        {
            return await _opportunityRepository.GetTotalValueByUserAsync(userId);
        }

        public async Task<IEnumerable<Opportunity>> GetPagedOpportunitiesAsync(int pageNumber, int pageSize)
        {
            return await _opportunityRepository.GetPagedAsync(pageNumber, pageSize);
        }

        public async Task<Dictionary<string, decimal>> GetOpportunitiesByStageValueAsync()
        {
            var opportunities = await _opportunityRepository.GetOpportunitiesWithDetailsAsync();
            return opportunities
                .GroupBy(o => o.Stage.Name)
                .ToDictionary(g => g.Key, g => g.Sum(o => o.EstimatedValue));
        }
    }
}