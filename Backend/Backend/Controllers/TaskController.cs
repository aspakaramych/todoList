using Backend.Abstractions;
using Backend.Contracts;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
public class TaskController : ControllerBase
{
    private readonly ITasksService _tasksService;

    public TaskController(ITasksService tasksService)
    {
        _tasksService = tasksService;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<TaskResponse>>> GetTasks()
    {
        var tasks = await _tasksService.GetTasks();
        var taskResponses = tasks.Select(t => new TaskResponse(t.Id, t.Text, t.Completed));
        return Ok(taskResponses);
    }
    
    [HttpPost("/addTask")]
    public async Task<ActionResult> AddTask([FromBody] TaskRequest taskRequest)
    {
        var task = new TaskModel
        {
            Id = taskRequest.id,
            Text = taskRequest.text,
            Completed = taskRequest.completed
        };
        var status = await _tasksService.AddTask(task);
        if (status)
        {
            return Created();
        }
        return BadRequest();
    }
    
    [HttpPut("/updateText")]
    public async Task<ActionResult> UpdateTask([FromBody] UpdateTaskRequest updateTaskRequest)
    {
        var status = await _tasksService.UpdateText(updateTaskRequest.id, updateTaskRequest.newText);
        if (status)
        {
            return Ok();
        }
        return BadRequest();
    }
    
    [HttpPut("/complete")]
    public async Task<ActionResult> CompleteTask(Guid taskId)
    {
        var status = await _tasksService.CompleteTask(taskId);
        if (status)
        {
            return Ok();
        }
        return BadRequest();
    }
    
    [HttpDelete]
    public async Task<ActionResult> DeleteTask(Guid taskId)
    {
        var status = await _tasksService.DeleteTask(taskId);
        if (status)
        {
            return Ok();
        }
        return BadRequest();
    }
    
    [HttpPost("/loadTasks")]
    public async Task<ActionResult> AddTasks([FromBody] TasksRequest tasksRequest)
    {
        var tasks = tasksRequest.tasks.Select(rq => new TaskModel{ Id = rq.id, Text = rq.text, Completed = rq.completed }).ToList();
        var status = await _tasksService.LoadTasks(tasks);
        if (status)
        {
            return Ok();
        }
        return BadRequest();
    }
}