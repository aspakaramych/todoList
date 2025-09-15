import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:todo_list/models/TaskModel.dart';
import 'package:todo_list/screens/NodeEditorScreen.dart';
import 'package:todo_list/widgets/CustomButton.dart';
import 'package:todo_list/widgets/TaskCard.dart';
import 'package:file_picker/file_picker.dart';

class TaskListPage extends StatefulWidget {
  const TaskListPage({super.key});

  @override
  State<StatefulWidget> createState() => _TaskListPageState();
}

class _TaskListPageState extends State<TaskListPage> {
  final List<TaskModel> _tasks = [];

  final Set<String> _selectedTaskIds = {};

  void _addTask(String newText) {
    if (newText.isNotEmpty) {
      setState(() {
        _tasks.add(TaskModel(text: newText));
      });
    }
  }

  void _navigateToCreateTask() async {
    final String? newTaskText = await Navigator.of(
      context,
    ).push(MaterialPageRoute(builder: (context) => const NodeEditorScreen()));
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

  void _exportTasks() async {
    final List<TaskModel> tasksToExport =
    _tasks.where((task) => _selectedTaskIds.contains(task.id)).toList();

    if (tasksToExport.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Пожалуйста, выберите задачи для экспорта.')),
      );
      return;
    }

    final List<Map<String, dynamic>> taskMaps =
    tasksToExport.map((task) => task.toJson()).toList();
    final String jsonString = jsonEncode(taskMaps);

    final Uint8List fileBytes = Uint8List.fromList(utf8.encode(jsonString));

    try {
      final String? filePath = await FilePicker.platform.saveFile(
        dialogTitle: 'Выберите папку для сохранения файла',
        fileName: 'tasks_export.json',
        allowedExtensions: ['json'],
        bytes: fileBytes,
      );

      if (filePath != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Файл успешно сохранен по пути: $filePath')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Экспорт отменен')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ошибка при экспорте: $e')),
      );
    }
  }

  void _importTasks() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['json'],
      );

      if (result != null) {
        final String? filePath = result.files.single.path;
        if (filePath == null) {
          throw Exception('Не удалось получить путь к файлу.');
        }

        final File file = File(filePath);
        final String jsonString = await file.readAsString();

        final List<dynamic> jsonList = jsonDecode(jsonString);

        final List<TaskModel> importedTasks = jsonList
            .map((json) => TaskModel.fromJson(json))
            .toList();

        setState(() {
          _tasks.addAll(importedTasks);
          _selectedTaskIds.clear();
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Успешно импортировано ${importedTasks.length} задач.')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Импорт отменен.')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ошибка при импорте: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    bool isSelectionMode = _selectedTaskIds.isNotEmpty;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Список задач"),
        actions: <Widget>[
          if (isSelectionMode) ...[
            CustomButton(
              icon: 'lib/assets/trash.svg',
              func: _deleteSelectedTasks,
            ),
            CustomButton(
              func: _exportTasks,
              icon: "lib/assets/download.svg",
            ),
          ] else ...[
            CustomButton(
              func: _importTasks,
              icon: "lib/assets/upload.svg",
            ),
          ]
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
