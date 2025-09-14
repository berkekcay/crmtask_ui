using Microsoft.EntityFrameworkCore;
using CRM.Core.Models;

namespace CRM.DataAccess
{
    public class CrmDbContext : DbContext
    {
        public CrmDbContext(DbContextOptions<CrmDbContext> options) : base(options)
        {
        }

        // User Management
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }

        // Customer Management
        public DbSet<Company> Companies { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        // Sales Management
        public DbSet<Opportunity> Opportunities { get; set; }
        public DbSet<SalesStage> SalesStages { get; set; }

        // Task Management
        public DbSet<CrmTask> Tasks { get; set; }
        public DbSet<TaskComment> TaskComments { get; set; }

        // Communication
        public DbSet<Activity> Activities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User - UserRole relationship
            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Role - Permission relationship
            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Company - Contact relationship
            modelBuilder.Entity<Contact>()
                .HasOne(c => c.Company)
                .WithMany(co => co.Contacts)
                .HasForeignKey(c => c.CompanyId)
                .OnDelete(DeleteBehavior.SetNull);

            // Opportunity relationships
            modelBuilder.Entity<Opportunity>()
                .HasOne(o => o.Company)
                .WithMany(c => c.Opportunities)
                .HasForeignKey(o => o.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Opportunity>()
                .HasOne(o => o.Contact)
                .WithMany()
                .HasForeignKey(o => o.ContactId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Opportunity>()
                .HasOne(o => o.Stage)
                .WithMany(s => s.Opportunities)
                .HasForeignKey(o => o.StageId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Opportunity>()
                .HasOne(o => o.AssignedUser)
                .WithMany()
                .HasForeignKey(o => o.AssignedUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Task relationships
            modelBuilder.Entity<CrmTask>()
                .HasOne(t => t.AssignedUser)
                .WithMany(u => u.AssignedTasks)
                .HasForeignKey(t => t.AssignedUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CrmTask>()
                .HasOne(t => t.Company)
                .WithMany()
                .HasForeignKey(t => t.CompanyId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<CrmTask>()
                .HasOne(t => t.Contact)
                .WithMany(c => c.Tasks)
                .HasForeignKey(t => t.ContactId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<CrmTask>()
                .HasOne(t => t.Opportunity)
                .WithMany(o => o.Tasks)
                .HasForeignKey(t => t.OpportunityId)
                .OnDelete(DeleteBehavior.SetNull);

            // TaskComment relationships
            modelBuilder.Entity<TaskComment>()
                .HasOne(tc => tc.Task)
                .WithMany(t => t.Comments)
                .HasForeignKey(tc => tc.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TaskComment>()
                .HasOne(tc => tc.User)
                .WithMany()
                .HasForeignKey(tc => tc.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Activity relationships
            modelBuilder.Entity<Activity>()
                .HasOne(a => a.User)
                .WithMany(u => u.Activities)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Activity>()
                .HasOne(a => a.Company)
                .WithMany(c => c.Activities)
                .HasForeignKey(a => a.CompanyId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Activity>()
                .HasOne(a => a.Contact)
                .WithMany(c => c.Activities)
                .HasForeignKey(a => a.ContactId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Activity>()
                .HasOne(a => a.Opportunity)
                .WithMany(o => o.Activities)
                .HasForeignKey(a => a.OpportunityId)
                .OnDelete(DeleteBehavior.SetNull);

            // Indexes for performance
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Company>()
                .HasIndex(c => c.Name);

            modelBuilder.Entity<Company>()
                .Property(c => c.AnnualRevenue)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Contact>()
                .HasIndex(c => c.Email);

            modelBuilder.Entity<CrmTask>()
                .HasIndex(t => t.DueDate);

            modelBuilder.Entity<CrmTask>()
                .HasIndex(t => t.Status);

            modelBuilder.Entity<Activity>()
                .HasIndex(a => a.ScheduledAt);

            // Seed Data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Admin", Description = "System Administrator", CreatedBy = "System" },
                new Role { Id = 2, Name = "Manager", Description = "Sales Manager", CreatedBy = "System" },
                new Role { Id = 3, Name = "SalesRep", Description = "Sales Representative", CreatedBy = "System" },
                new Role { Id = 4, Name = "User", Description = "Regular User", CreatedBy = "System" }
            );

            // Seed Permissions
            modelBuilder.Entity<Permission>().HasData(
                // User Management
                new Permission { Id = 1, Name = "Users.View", Description = "View Users", Module = "Users", CreatedBy = "System" },
                new Permission { Id = 2, Name = "Users.Create", Description = "Create Users", Module = "Users", CreatedBy = "System" },
                new Permission { Id = 3, Name = "Users.Update", Description = "Update Users", Module = "Users", CreatedBy = "System" },
                new Permission { Id = 4, Name = "Users.Delete", Description = "Delete Users", Module = "Users", CreatedBy = "System" },

                // Company Management
                new Permission { Id = 5, Name = "Companies.View", Description = "View Companies", Module = "Companies", CreatedBy = "System" },
                new Permission { Id = 6, Name = "Companies.Create", Description = "Create Companies", Module = "Companies", CreatedBy = "System" },
                new Permission { Id = 7, Name = "Companies.Update", Description = "Update Companies", Module = "Companies", CreatedBy = "System" },
                new Permission { Id = 8, Name = "Companies.Delete", Description = "Delete Companies", Module = "Companies", CreatedBy = "System" },

                // Contact Management
                new Permission { Id = 9, Name = "Contacts.View", Description = "View Contacts", Module = "Contacts", CreatedBy = "System" },
                new Permission { Id = 10, Name = "Contacts.Create", Description = "Create Contacts", Module = "Contacts", CreatedBy = "System" },
                new Permission { Id = 11, Name = "Contacts.Update", Description = "Update Contacts", Module = "Contacts", CreatedBy = "System" },
                new Permission { Id = 12, Name = "Contacts.Delete", Description = "Delete Contacts", Module = "Contacts", CreatedBy = "System" },

                // Opportunity Management
                new Permission { Id = 13, Name = "Opportunities.View", Description = "View Opportunities", Module = "Opportunities", CreatedBy = "System" },
                new Permission { Id = 14, Name = "Opportunities.Create", Description = "Create Opportunities", Module = "Opportunities", CreatedBy = "System" },
                new Permission { Id = 15, Name = "Opportunities.Update", Description = "Update Opportunities", Module = "Opportunities", CreatedBy = "System" },
                new Permission { Id = 16, Name = "Opportunities.Delete", Description = "Delete Opportunities", Module = "Opportunities", CreatedBy = "System" },

                // Task Management
                new Permission { Id = 17, Name = "Tasks.View", Description = "View Tasks", Module = "Tasks", CreatedBy = "System" },
                new Permission { Id = 18, Name = "Tasks.Create", Description = "Create Tasks", Module = "Tasks", CreatedBy = "System" },
                new Permission { Id = 19, Name = "Tasks.Update", Description = "Update Tasks", Module = "Tasks", CreatedBy = "System" },
                new Permission { Id = 20, Name = "Tasks.Delete", Description = "Delete Tasks", Module = "Tasks", CreatedBy = "System" }
            );

            // Seed Sales Stages
            modelBuilder.Entity<SalesStage>().HasData(
                new SalesStage { Id = 1, Name = "Lead", Description = "Initial lead", Order = 1, Color = "#6c757d", CreatedBy = "System" },
                new SalesStage { Id = 2, Name = "Qualified", Description = "Qualified lead", Order = 2, Color = "#17a2b8", CreatedBy = "System" },
                new SalesStage { Id = 3, Name = "Proposal", Description = "Proposal sent", Order = 3, Color = "#ffc107", CreatedBy = "System" },
                new SalesStage { Id = 4, Name = "Negotiation", Description = "Under negotiation", Order = 4, Color = "#fd7e14", CreatedBy = "System" },
                new SalesStage { Id = 5, Name = "Won", Description = "Deal won", Order = 5, Color = "#28a745", IsWon = true, CreatedBy = "System" },
                new SalesStage { Id = 6, Name = "Lost", Description = "Deal lost", Order = 6, Color = "#dc3545", IsLost = true, CreatedBy = "System" }
            );

            // Admin Role gets all permissions
            var adminPermissions = Enumerable.Range(1, 20).Select(i =>
                new RolePermission { Id = i, RoleId = 1, PermissionId = i, CreatedBy = "System" }).ToArray();

            modelBuilder.Entity<RolePermission>().HasData(adminPermissions);

            // Manager Role gets most permissions (except user management)
            var managerPermissions = Enumerable.Range(5, 16).Select((permId, index) =>
                new RolePermission { Id = 21 + index, RoleId = 2, PermissionId = permId, CreatedBy = "System" }).ToArray();

            modelBuilder.Entity<RolePermission>().HasData(managerPermissions);
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var entry in entries)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.Now;
                        break;
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.Now;
                        break;
                }
            }
        }
    }
}