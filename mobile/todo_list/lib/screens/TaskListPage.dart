import 'package:flutter/material.dart';
import 'package:todo_list/models/TaskModel.dart';
import 'package:todo_list/screens/NodeEditorScreen.dart';
import 'package:todo_list/widgets/CustomButton.dart';
import 'package:todo_list/widgets/TaskCard.dart';

class TaskListPage extends StatefulWidget {
  const TaskListPage({super.key});

  @override
  State<StatefulWidget> createState() => _TaskListPageState();
}

class _TaskListPageState extends State<TaskListPage> {
  final List<TaskModel> _tasks = [
    TaskModel(text: "Сходить в магазин"),
    TaskModel(text: "Помыть посуду"),
    TaskModel(text: "Написать код"),
  ];

  final Set<String> _selectedTaskIds = {};

  void _addTask(String newText) {
    if (newText.isNotEmpty) {
      setState(() {
        _tasks.add(TaskModel(text: newText));
      });
    }
  }

  void _navigateToCreateTask() async {
    final String? newTaskText = await Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => const NodeEditorScreen()),
    );
    if (newTaskText != null) {
      _addTask(newTaskText);
    }
  }

  void _navigateToEditTask(int index) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => NodeEditorScreen(text: _tasks[index].text),
      ),
    );
    if (result != null) {
      setState(() {
        _tasks[index].text = result;
      });
    }
  }


  void _handleTap(String taskId, int index) {
    bool isSelectionMode = _selectedTaskIds.isNotEmpty;

    if (isSelectionMode) {
      if (_selectedTaskIds.contains(taskId)) {
        _selectedTaskIds.remove(taskId);
      } else {
        _selectedTaskIds.add(taskId);
      }
    } else {
      _navigateToEditTask(index);
    }
    setState(() {});
  }

  void _handleLongPress(String taskId) {
    setState(() {
      if (!_selectedTaskIds.contains(taskId)) {
        _selectedTaskIds.add(taskId);
      }
    });
  }

  void _deleteSelectedTasks() {
    setState(() {
      _tasks.removeWhere((task) => _selectedTaskIds.contains(task.id));
      _selectedTaskIds.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    bool isSelectionMode = _selectedTaskIds.isNotEmpty;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Список задач"),
        actions: <Widget>[
          if (isSelectionMode)
            IconButton(
              icon: const Icon(Icons.delete),
              onPressed: _deleteSelectedTasks,
            ),
        ],
      ),
      body: Stack(
        children: <Widget>[
          Positioned.fill(
            child: ListView.builder(
              padding: const EdgeInsets.all(8.0),
              itemCount: _tasks.length,
              itemBuilder: (context, index) {
                final task = _tasks[index];
                final isSelected = _selectedTaskIds.contains(task.id);

                return TaskCard(
                  text: task.text,
                  isComplete: task.isComplete,
                  isSelected: isSelected,
                  onToggleComplete: () {
                    _tasks[index].isComplete = !_tasks[index].isComplete;
                    setState(() {});
                  },
                  onTap: () => _handleTap(task.id, index),
                  onLongPress: () => _handleLongPress(task.id),
                );
              },
            ),
          ),
          Positioned(
            bottom: 16.0,
            right: 16.0,
            child: CustomButton(
              icon: 'lib/assets/note.svg',
              func: _navigateToCreateTask,
            ),
          ),
        ],
      ),
    );
  }
}