namespace Backend.Contracts;

public record TasksRequest(ICollection<TaskRequest> tasks);