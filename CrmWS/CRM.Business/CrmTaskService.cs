using CRM.Core.Models;
using CRM.Core.Interfaces;
using CRM.Business.Interfaces;
using TaskStatus = CRM.Core.Models.TaskStatus;

namespace CRM.Business.Services
{
    public class CrmTaskService : ICrmTaskService
    {
        private readonly ICrmTaskRepository _taskRepository;

        public CrmTaskService(ICrmTaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        public async Task<IEnumerable<CrmTask>> GetAllTasksAsync()
        {
            return await _taskRepository.GetAllAsync();
        }

        public async Task<CrmTask?> GetTaskByIdAsync(int id)
        {
            return await _taskRepository.GetByIdAsync(id);
        }

        public async Task<CrmTask?> GetTaskWithCommentsAsync(int id)
        {
            return await _taskRepository.GetWithCommentsAsync(id);
        }

        public async Task<IEnumerable<CrmTask>> GetTasksByUserAsync(int userId)
        {
            return await _taskRepository.GetByUserAsync(userId);
        }

        public async Task<IEnumerable<CrmTask>> GetTasksByStatusAsync(TaskStatus status)
        {
            return await _taskRepository.GetByStatusAsync(status);
        }

        public async Task<IEnumerable<CrmTask>> GetOverdueTasksAsync()
        {
            return await _taskRepository.GetOverdueTasksAsync();
        }

        public async Task<IEnumerable<CrmTask>> GetTasksDueTodayAsync()
        {
            return await _taskRepository.GetTasksDueTodayAsync();
        }

        public async Task<CrmTask> CreateTaskAsync(CrmTask task)
        {
            task.CreatedAt = DateTime.Now;
            return await _taskRepository.AddAsync(task);
        }

        public async Task<CrmTask> UpdateTaskAsync(CrmTask task)
        {
            var existingTask = await _taskRepository.GetByIdAsync(task.Id);
            if (existingTask == null)
            {
                throw new KeyNotFoundException("Task not found");
            }

            task.UpdatedAt = DateTime.Now;
            return await _taskRepository.UpdateAsync(task);
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null) return false;

            task.IsDeleted = true;
            task.UpdatedAt = DateTime.Now;
            await _taskRepository.UpdateAsync(task);
            return true;
        }

        public async Task<bool> CompleteTaskAsync(int id)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null) return false;

            task.Status = TaskStatus.Completed;
            task.CompletedAt = DateTime.Now;
            task.UpdatedAt = DateTime.Now;

            await _taskRepository.UpdateAsync(task);
            return true;
        }

        public async Task<TaskComment> AddCommentAsync(int taskId, string comment, int userId)
        {
            var taskComment = new TaskComment
            {
                TaskId = taskId,
                UserId = userId,
                Comment = comment,
                CreatedAt = DateTime.Now,
                CreatedBy = userId.ToString()
            };

            // You would need a TaskCommentRepository for this
            await System.Threading.Tasks.Task.CompletedTask;
            return taskComment;
        }

        public async Task<IEnumerable<CrmTask>> GetPagedTasksAsync(int pageNumber, int pageSize)
        {
            return await _taskRepository.GetPagedAsync(pageNumber, pageSize);
        }

        public async Task<Dictionary<TaskStatus, int>> GetTaskStatusSummaryAsync(int? userId = null)
        {
            var tasks = userId.HasValue
                ? await _taskRepository.GetByUserAsync(userId.Value)
                : await _taskRepository.GetAllAsync();

            return tasks
                .GroupBy(t => t.Status)
                .ToDictionary(g => g.Key, g => g.Count());
        }
    }
}
