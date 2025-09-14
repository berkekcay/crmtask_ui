using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRM.Core.Models
{
    [Table("SalesStages")]
    public class SalesStage : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public int Order { get; set; }

        [MaxLength(50)]
        public string Color { get; set; } = "#007bff";

        public bool IsWon { get; set; } = false;
        public bool IsLost { get; set; } = false;

        // Navigation Properties
        public virtual ICollection<Opportunity> Opportunities { get; set; } = new List<Opportunity>();
    }
}