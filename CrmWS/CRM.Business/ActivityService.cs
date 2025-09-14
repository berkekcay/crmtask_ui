using CRM.Core.Models;
using CRM.Core.Interfaces;
using CRM.Business.Interfaces;

namespace CRM.Business.Services
{
    public class ActivityService : IActivityService
    {
        private readonly IActivityRepository _activityRepository;

        public ActivityService(IActivityRepository activityRepository)
        {
            _activityRepository = activityRepository;
        }

        public async Task<IEnumerable<Activity>> GetAllActivitiesAsync()
        {
            return await _activityRepository.GetAllAsync();
        }

        public async Task<Activity?> GetActivityByIdAsync(int id)
        {
            return await _activityRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Activity>> GetActivitiesByUserAsync(int userId)
        {
            return await _activityRepository.GetByUserAsync(userId);
        }

        public async Task<IEnumerable<Activity>> GetActivitiesByCompanyAsync(int companyId)
        {
            return await _activityRepository.GetByCompanyAsync(companyId);
        }

        public async Task<IEnumerable<Activity>> GetActivitiesByContactAsync(int contactId)
        {
            return await _activityRepository.GetByContactAsync(contactId);
        }

        public async Task<IEnumerable<Activity>> GetActivitiesByOpportunityAsync(int opportunityId)
        {
            return await _activityRepository.GetByOpportunityAsync(opportunityId);
        }

        public async Task<IEnumerable<Activity>> GetActivitiesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _activityRepository.GetByDateRangeAsync(startDate, endDate);
        }

        public async Task<Activity> CreateActivityAsync(Activity activity)
        {
            activity.CreatedAt = DateTime.Now;
            return await _activityRepository.AddAsync(activity);
        }

        public async Task<Activity> UpdateActivityAsync(Activity activity)
        {
            var existingActivity = await _activityRepository.GetByIdAsync(activity.Id);
            if (existingActivity == null)
            {
                throw new KeyNotFoundException("Activity not found");
            }

            activity.UpdatedAt = DateTime.Now;
            return await _activityRepository.UpdateAsync(activity);
        }

        public async Task<bool> DeleteActivityAsync(int id)
        {
            var activity = await _activityRepository.GetByIdAsync(id);
            if (activity == null) return false;

            activity.IsDeleted = true;
            activity.UpdatedAt = DateTime.Now;
            await _activityRepository.UpdateAsync(activity);
            return true;
        }

        public async Task<IEnumerable<Activity>> GetUpcomingActivitiesAsync(int userId)
        {
            var activities = await _activityRepository.GetByUserAsync(userId);
            return activities.Where(a => a.ScheduledAt.HasValue && a.ScheduledAt > DateTime.Now)
                           .OrderBy(a => a.ScheduledAt);
        }

        public async Task<IEnumerable<Activity>> GetPagedActivitiesAsync(int pageNumber, int pageSize)
        {
            return await _activityRepository.GetPagedAsync(pageNumber, pageSize);
        }

        public async Task<Dictionary<ActivityType, int>> GetActivityTypeSummaryAsync(int? userId = null)
        {
            var activities = userId.HasValue
                ? await _activityRepository.GetByUserAsync(userId.Value)
                : await _activityRepository.GetAllAsync();

            return activities
                .GroupBy(a => a.Type)
                .ToDictionary(g => g.Key, g => g.Count());
        }
    }
}