using Microsoft.EntityFrameworkCore;
using TaskManagerApp_FutureXcel.Models;

namespace TaskManagerApp_FutureXcel.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
           : base(options)
        {
        }

        public DbSet<TaskItem> Tasks { get; set; }
    }
}
