namespace CRM.Core.Models
{
    public enum TaskStatus
    {
        Pending = 1,
        InProgress = 2,
        Completed = 3,
        Cancelled = 4
    }

    public enum TaskPriority
    {
        Low = 1,
        Medium = 2,
        High = 3,
        Critical = 4
    }

    public enum ActivityType
    {
        Call = 1,
        Meeting = 2,
        Email = 3,
        Note = 4,
        Task = 5
    }
}