namespace Backend.Models;

public class TaskModel
{
    public Guid Id { get; set; }
    public string Text { get; set; }
    public bool Completed { get; set; } = false;
}