import 'package:uuid/uuid.dart';

final uuid = const Uuid();

class TaskModel {
  final String id;
  String text;
  bool isComplete;

  TaskModel({required this.text, this.isComplete = false}) : id = uuid.v4();

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    return TaskModel.fromId(
      id: json['id'],
      text: json['text'],
      isComplete: json['completed'],
    );
  }

  TaskModel.fromId({
    required this.id,
    required this.text,
    required this.isComplete
  });

  Map<String, dynamic> toJson(){
    return {
      'id': id,
      'text': text,
      'completed': isComplete,
    };
  }
}