namespace Backend.Contracts;

public record TaskRequest(Guid id, string text, bool completed);