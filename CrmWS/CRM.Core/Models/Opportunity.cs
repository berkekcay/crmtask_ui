using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;

namespace CRM.Core.Models
{
    [Table("Opportunities")]
    public class Opportunity : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal EstimatedValue { get; set; }

        [Range(0, 100)]
        public int Probability { get; set; } = 0;

        public DateTime? ExpectedCloseDate { get; set; }

        public DateTime? ActualCloseDate { get; set; }

        [Required]
        public int StageId { get; set; }

        [Required]
        public int CompanyId { get; set; }

        public int? ContactId { get; set; }

        public int AssignedUserId { get; set; }

        // Navigation Properties
        public virtual SalesStage Stage { get; set; } = null!;
        public virtual Company Company { get; set; } = null!;
        public virtual Contact? Contact { get; set; }
        public virtual User AssignedUser { get; set; } = null!;
        public virtual ICollection<Activity> Activities { get; set; } = new List<Activity>();
        public virtual ICollection<CrmTask> Tasks { get; set; } = new List<CrmTask>();
    }
}