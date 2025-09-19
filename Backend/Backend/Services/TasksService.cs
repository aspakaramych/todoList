using Backend.Abstractions;
using Backend.Data;
using Backend.Data.Entities;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class TasksService : ITasksService
{
    private readonly ApplicationDbContext _context;

    public TasksService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ICollection<TaskModel>> GetTasks()
    {
        var taskEntites = await _context.Tasks.AsNoTracking().ToListAsync();
        var tasks = taskEntites.Select(entity => new TaskModel {Id = entity.Id, Text = entity.Text, Completed = entity.Completed}).ToList();
        return tasks;
    }

    public async Task<bool> AddTask(TaskModel task)
    {
        var taskEntity = new TaskEntity
        {
            Id = task.Id,
            Text = task.Text,
            Completed = task.Completed
        };
        await _context.Tasks.AddAsync(taskEntity);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateText(Guid id, string newText)
    {
        try
        {
            await _context.Tasks.Where(entity => entity.Id == id).ExecuteUpdateAsync(s => s.SetProperty(e => e.Text, newText));
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        return true;
    }

    public async Task<bool> CompleteTask(Guid id)
    {
        try
        {
            var task = await _context.Tasks.Where(entity => entity.Id == id).FirstAsync();
            await _context.Tasks.Where(entity => entity.Id == id).ExecuteUpdateAsync(s => s.SetProperty(e => e.Completed, !task.Completed));
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        return true;
    }

    public async Task<bool> DeleteTask(Guid id)
    {
        try
        {
            await _context.Tasks.Where(entity => entity.Id == id).ExecuteDeleteAsync();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        return true;
    }

    public async Task<bool> LoadTasks(ICollection<TaskModel> tasks)
    {
        var taskEntities = tasks.Select(entity => new TaskEntity {Id = entity.Id, Text = entity.Text}).ToList();
        await _context.Tasks.AddRangeAsync(taskEntities);
        return await _context.SaveChangesAsync() > 0;
    }
}