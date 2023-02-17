using Microsoft.EntityFrameworkCore;
using RookieOnlineAssetManagement.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace RookieOnlineAssetManagement.Data;
public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Assignment> Assignments { get; set; }
    public virtual DbSet<Asset> Assets { get; set; }
    public virtual DbSet<Category> Categories { get; set; }
    public virtual DbSet<ReturningRequest> ReturningRequests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.ToTable("Assignments");

            entity.Property(e => e.AssignedBy).HasMaxLength(450);
            entity.Property(e => e.AssignedTo).HasMaxLength(450);

            entity.HasOne(d => d.AssignedByUser).WithMany(p => p.AssignedByAssignments)
                .HasForeignKey(d => d.AssignedBy)
                .HasConstraintName("FK_AssignmentBy_User");

            entity.HasOne(d => d.AssignedToUser).WithMany(p => p.AssignedToAssignments)
                .HasForeignKey(d => d.AssignedTo)
                .HasConstraintName("FK_AssignmentTo_User");

        });

        modelBuilder.Entity<Category>()
          .HasIndex(p => new { p.Prefix, p.Name })
          .IsUnique(true);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("User");
        });

        base.OnModelCreating(modelBuilder);
    }
}
