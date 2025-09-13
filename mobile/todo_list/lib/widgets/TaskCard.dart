import 'package:flutter/material.dart';
import 'package:todo_list/screens/NodeEditorScreen.dart';

class TaskCard extends StatefulWidget {
  final String text;
  const TaskCard({super.key, required this.text});

  @override
  State<TaskCard> createState() => _TaskCardState();
}

class _TaskCardState extends State<TaskCard> {
  String _text = "";
  bool _complete = false;

  @override
  void initState() {
    super.initState();
    _text = widget.text;
  }

  void _navigateToEditScreen() async {
    final result = await Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => NodeEditorScreen(text: _text)));
    if (result != null){
      setState(() {
        _text = result;
      });
    }
  }

  void _toggleComplete() {
    setState(() {
      _complete = !_complete;
    });
  }

  @override
  Widget build(BuildContext context){
    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        title: Text(
          _text,
          style: TextStyle(
            decoration: _complete ? TextDecoration.lineThrough : null,
          ),
        ),
        trailing: Checkbox(value: _complete, onChanged: (bool? newVal){
          _toggleComplete();
        }),
        onTap: _navigateToEditScreen,
      ),
    );
  }
}