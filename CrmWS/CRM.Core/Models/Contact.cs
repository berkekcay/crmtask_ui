using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;

namespace CRM.Core.Models
{
    [Table("Contacts")]
    public class Contact : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? Email { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(20)]
        public string? Mobile { get; set; }

        [MaxLength(100)]
        public string? Position { get; set; }

        [MaxLength(100)]
        public string? Department { get; set; }

        public bool IsPrimaryContact { get; set; } = false;

        public int? CompanyId { get; set; }

        // Navigation Properties
        public virtual Company? Company { get; set; }
        public virtual ICollection<Activity> Activities { get; set; } = new List<Activity>();
        public virtual ICollection<CrmTask> Tasks { get; set; } = new List<CrmTask>();
    }
}