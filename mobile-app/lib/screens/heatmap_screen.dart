import 'package:flutter/material.dart';

class HeatmapScreen extends StatelessWidget {
  const HeatmapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Heatmaps")),
      body: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          height: 300,
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [Colors.red, Colors.blue]),
            borderRadius: BorderRadius.circular(20),
          ),
          child: const Center(
              child: Text("Heatmap Visualization",
                  style: TextStyle(color: Colors.white, fontSize: 18))),
        ),
      ),
    );
  }
}
