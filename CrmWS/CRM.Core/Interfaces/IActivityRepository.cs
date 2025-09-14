using CRM.Core.Models;

namespace CRM.Core.Interfaces
{
    public interface IActivityRepository : IGenericRepository<Activity>
    {
        Task<IEnumerable<Activity>> GetByUserAsync(int userId);
        Task<IEnumerable<Activity>> GetByCompanyAsync(int companyId);
        Task<IEnumerable<Activity>> GetByContactAsync(int contactId);
        Task<IEnumerable<Activity>> GetByOpportunityAsync(int opportunityId);
        Task<IEnumerable<Activity>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
}