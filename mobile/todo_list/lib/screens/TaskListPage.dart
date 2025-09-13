import 'package:flutter/material.dart';
import 'package:todo_list/widgets/TaskCard.dart';

class TaskListPage extends StatefulWidget {
  const TaskListPage({super.key});

  @override
  State<StatefulWidget> createState() => _TaskListPageState();
}

class _TaskListPageState extends State<TaskListPage> {
  final List<Widget> _tasks = [
  ];
  
  void _addTask(String newText) {
    setState(() {
      _tasks.add(TaskCard(text: newText));
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: ListView(
        padding: const EdgeInsets.all(8.0),
        children: _tasks,
      ),
    );
  }
}