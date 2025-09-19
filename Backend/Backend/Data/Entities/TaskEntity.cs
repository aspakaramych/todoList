using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Data.Entities;

[Table("Tasks")]
public class TaskEntity
{
    [Key]
    [Column("Id")]
    public Guid Id { get; set; }
    
    [Column("Text")]
    public string Text { get; set; }
    
    [Column("Completed")]
    [Required]
    public bool Completed { get; set; } = false;
}