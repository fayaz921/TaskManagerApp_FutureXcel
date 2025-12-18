using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagerApp_FutureXcel.Data;
using TaskManagerApp_FutureXcel.Models;

namespace TaskManagerApp_FutureXcel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // CREATE TASK
        [HttpPost]
        public async Task<IActionResult> CreateTask(TaskItem task)
        {
            if (!ModelState.IsValid)
            {
                // return detailed ModelState errors
                var errors = ModelState.SelectMany(x => x.Value.Errors)
                                       .Select(e => e.ErrorMessage)
                                       .ToList();
                return BadRequest(new { message = "ModelState invalid", errors });
            }

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, task);
        }

        // GET TASK BY ID 
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
                return NotFound();

            return Ok(task);
        }

        // GET ALL TASKS
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks = await _context.Tasks
                                      .OrderByDescending(t => t.CreatedAt)
                                      .ToListAsync();

            return Ok(tasks);
        }

        // UPDATE TASK
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskItem updatedTask)
        {
            if (id != updatedTask.Id)
                return BadRequest("Task ID mismatch");

            if (!ModelState.IsValid)
            {
                var errors = ModelState.SelectMany(x => x.Value.Errors)
                                       .Select(e => e.ErrorMessage)
                                       .ToList();
                return BadRequest(new { message = "ModelState invalid", errors });
            }

            var existingTask = await _context.Tasks.FindAsync(id);

            if (existingTask == null)
                return NotFound();

            existingTask.Title = updatedTask.Title;
            existingTask.Description = updatedTask.Description;
            existingTask.Status = updatedTask.Status;
            existingTask.DueDate = updatedTask.DueDate;

            await _context.SaveChangesAsync();

            return Ok(existingTask);
        }

        // DELETE TASK
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
                return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }



    }
}

