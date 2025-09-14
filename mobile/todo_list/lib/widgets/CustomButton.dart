import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class CustomButton extends StatelessWidget{
  final String icon;
  final VoidCallback func;

  late double width = 40;
  late double height = 40;

  CustomButton({super.key, required this.icon, required this.func});

  @override
  Widget build(BuildContext context) {
    return IconButton(onPressed: func, icon: SvgPicture.asset(icon, width: width, height: height));
  }
}