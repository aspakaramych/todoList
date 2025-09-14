import 'package:flutter/material.dart';

class TaskCard extends StatelessWidget {
  final String text;
  final bool isComplete;
  final bool isSelected;
  final VoidCallback onToggleComplete;
  final VoidCallback onTap;
  final VoidCallback onLongPress;

  const TaskCard({
    super.key,
    required this.text,
    required this.isComplete,
    this.isSelected = false,
    required this.onToggleComplete,
    required this.onTap,
    required this.onLongPress,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onLongPress: onLongPress,
      onTap: onTap,
      child: Card(
        elevation: 4,
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        color: isSelected ? Colors.blue.withOpacity(0.3) : null,
        child: ListTile(
          leading: isSelected
              ? Checkbox(
            value: isSelected,
            onChanged: (bool? newVal) {
              onTap();
            },
          )
              : null,
          title: Text(
            text,
            style: TextStyle(
              decoration: isComplete ? TextDecoration.lineThrough : null,
              decorationColor: Colors.black,
              decorationThickness: 2.0,
            ),
          ),
          trailing: Checkbox(
            value: isComplete,
            onChanged: (bool? newVal) {
              onToggleComplete();
            },
          ),
        ),
      ),
    );
  }
}