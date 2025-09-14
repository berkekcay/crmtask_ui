using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRM.Core.Models
{
    [Table("Activities")]
    public class Activity : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;

        public string? Description { get; set; }

        public ActivityType Type { get; set; }

        public DateTime? ScheduledAt { get; set; }

        public int? Duration { get; set; } // minutes

        public int UserId { get; set; }

        public int? CompanyId { get; set; }
        public int? ContactId { get; set; }
        public int? OpportunityId { get; set; }

        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual Company? Company { get; set; }
        public virtual Contact? Contact { get; set; }
        public virtual Opportunity? Opportunity { get; set; }
    }
}