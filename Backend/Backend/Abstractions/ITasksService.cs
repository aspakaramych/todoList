using Backend.Models;

namespace Backend.Abstractions;

public interface ITasksService
{
    Task <ICollection<TaskModel>> GetTasks();
    Task<bool> AddTask(TaskModel task);
    Task<bool> UpdateText(Guid id, string newText);
    Task<bool> CompleteTask(Guid id);
    Task<bool> DeleteTask(Guid id);
    Task<bool> LoadTasks(ICollection<TaskModel> tasks);
}