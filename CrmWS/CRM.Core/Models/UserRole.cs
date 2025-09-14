using System.ComponentModel.DataAnnotations.Schema;

namespace CRM.Core.Models
{
    [Table("UserRoles")]
    public class UserRole : BaseEntity
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }

        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual Role Role { get; set; } = null!;
    }
}