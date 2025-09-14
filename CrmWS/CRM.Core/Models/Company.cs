using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CRM.Core.Models;
using System.Diagnostics;

namespace CRM.Core.Models
{
    [Table("Companies")]
    public class Company : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(100)]
        public string? Industry { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(255)]
        public string? Email { get; set; }

        [MaxLength(255)]
        public string? Website { get; set; }

        [MaxLength(500)]
        public string? Address { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }

        [MaxLength(100)]
        public string? Country { get; set; }

        [MaxLength(20)]
        public string? PostalCode { get; set; }

        public decimal? AnnualRevenue { get; set; }

        public int? EmployeeCount { get; set; }

        // Navigation Properties
        public virtual ICollection<Contact> Contacts { get; set; } = new List<Contact>();
        public virtual ICollection<Opportunity> Opportunities { get; set; } = new List<Opportunity>();
        public virtual ICollection<Activity> Activities { get; set; } = new List<Activity>();
    }
}