using System.ComponentModel.DataAnnotations.Schema;

namespace CRM.Core.Models
{
    [Table("RolePermissions")]
    public class RolePermission : BaseEntity
    {
        public int RoleId { get; set; }
        public int PermissionId { get; set; }

        // Navigation Properties
        public virtual Role Role { get; set; } = null!;
        public virtual Permission Permission { get; set; } = null!;
    }
}