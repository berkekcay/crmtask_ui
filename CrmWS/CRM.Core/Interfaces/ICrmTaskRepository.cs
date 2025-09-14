using CRM.Core.Models;
using TaskStatus = CRM.Core.Models.TaskStatus;

namespace CRM.Core.Interfaces
{
    public interface ICrmTaskRepository : IGenericRepository<CrmTask>
    {
        Task<IEnumerable<CrmTask>> GetByUserAsync(int userId);
        Task<IEnumerable<CrmTask>> GetByStatusAsync(TaskStatus status);
        Task<IEnumerable<CrmTask>> GetOverdueTasksAsync();
        Task<IEnumerable<CrmTask>> GetTasksDueTodayAsync();
        Task<CrmTask?> GetWithCommentsAsync(int taskId);
    }
}