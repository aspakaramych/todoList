namespace Backend.Contracts;

public record UpdateTaskRequest(Guid id, string newText);