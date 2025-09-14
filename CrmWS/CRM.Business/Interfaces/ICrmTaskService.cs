using CRM.Core.Models;
using TaskStatus = CRM.Core.Models.TaskStatus;

namespace CRM.Business.Interfaces
{
    public interface ICrmTaskService
    {
        Task<IEnumerable<CrmTask>> GetAllTasksAsync();
        Task<CrmTask?> GetTaskByIdAsync(int id);
        Task<CrmTask?> GetTaskWithCommentsAsync(int id);
        Task<IEnumerable<CrmTask>> GetTasksByUserAsync(int userId);
        Task<IEnumerable<CrmTask>> GetTasksByStatusAsync(TaskStatus status);
        Task<IEnumerable<CrmTask>> GetOverdueTasksAsync();
        Task<IEnumerable<CrmTask>> GetTasksDueTodayAsync();
        Task<CrmTask> CreateTaskAsync(CrmTask task);
        Task<CrmTask> UpdateTaskAsync(CrmTask task);
        Task<bool> DeleteTaskAsync(int id);
        Task<bool> CompleteTaskAsync(int id);
        Task<TaskComment> AddCommentAsync(int taskId, string comment, int userId);
        Task<IEnumerable<CrmTask>> GetPagedTasksAsync(int pageNumber, int pageSize);
        Task<Dictionary<TaskStatus, int>> GetTaskStatusSummaryAsync(int? userId = null);
    }
}
