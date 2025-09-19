namespace Backend.Contracts;

public record TaskResponse(Guid id, string text, bool completed);