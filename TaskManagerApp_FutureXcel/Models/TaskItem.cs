using System.ComponentModel.DataAnnotations;

namespace TaskManagerApp_FutureXcel.Models
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } =string.Empty;

        public string? Description { get; set; }

        [Required]
        public TaskStatus Status { get; set; }  

        public DateTime? DueDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
