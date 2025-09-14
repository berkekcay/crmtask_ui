using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRM.Core.Models
{
    [Table("TaskComments")]
    public class TaskComment : BaseEntity
    {
        [Required]
        public string Comment { get; set; } = string.Empty;

        public int TaskId { get; set; }
        public int UserId { get; set; }

        // Navigation Properties
        public virtual CrmTask Task { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}