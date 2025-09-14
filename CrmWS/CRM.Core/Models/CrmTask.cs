using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRM.Core.Models
{
    [Table("Tasks")]
    public class CrmTask : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime? CompletedAt { get; set; }

        public TaskStatus Status { get; set; } = TaskStatus.Pending;

        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        public int AssignedUserId { get; set; }

        public int? CompanyId { get; set; }
        public int? ContactId { get; set; }
        public int? OpportunityId { get; set; }

        // Navigation Properties
        public virtual User AssignedUser { get; set; } = null!;
        public virtual Company? Company { get; set; }
        public virtual Contact? Contact { get; set; }
        public virtual Opportunity? Opportunity { get; set; }
        public virtual ICollection<TaskComment> Comments { get; set; } = new List<TaskComment>();
    }
}