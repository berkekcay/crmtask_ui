using CRM.Core.Models;

namespace CRM.Business.Interfaces
{
    public interface IActivityService
    {
        Task<IEnumerable<Activity>> GetAllActivitiesAsync();
        Task<Activity?> GetActivityByIdAsync(int id);
        Task<IEnumerable<Activity>> GetActivitiesByUserAsync(int userId);
        Task<IEnumerable<Activity>> GetActivitiesByCompanyAsync(int companyId);
        Task<IEnumerable<Activity>> GetActivitiesByContactAsync(int contactId);
        Task<IEnumerable<Activity>> GetActivitiesByOpportunityAsync(int opportunityId);
        Task<IEnumerable<Activity>> GetActivitiesByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<Activity> CreateActivityAsync(Activity activity);
        Task<Activity> UpdateActivityAsync(Activity activity);
        Task<bool> DeleteActivityAsync(int id);
        Task<IEnumerable<Activity>> GetUpcomingActivitiesAsync(int userId);
        Task<IEnumerable<Activity>> GetPagedActivitiesAsync(int pageNumber, int pageSize);
        Task<Dictionary<ActivityType, int>> GetActivityTypeSummaryAsync(int? userId = null);
    }
}