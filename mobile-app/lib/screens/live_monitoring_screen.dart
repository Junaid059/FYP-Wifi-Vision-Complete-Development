import 'package:flutter/material.dart';

class LiveMonitoringScreen extends StatelessWidget {
  const LiveMonitoringScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Live Monitoring",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),

          // Row for Active Devices, Detected Persons, Detected Objects
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildMetricCard("Active Devices", "13/15", "2 devices offline",
                  Icons.wifi, Colors.blue),
              _buildMetricCard("Detected Persons", "5", "1 in restricted",
                  Icons.person, Colors.green),
              _buildMetricCard("Detected Objects", "23", "5 unidentified",
                  Icons.remove_red_eye, Colors.orange),
            ],
          ),
        ],
      ),
    );
  }

  /// Widget for each metric card
  Widget _buildMetricCard(
      String title, String value, String subtitle, IconData icon, Color color) {
    return Container(
      width: 120, // Ensure proper width to prevent overflow
      height: 120, // Increase height for better spacing
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 5),
          Text(title,
              textAlign: TextAlign.center,
              style:
                  const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          Text(value,
              style: TextStyle(
                  fontSize: 18, fontWeight: FontWeight.bold, color: color)),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 5),
            child: Text(subtitle,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 12, color: Colors.grey)),
          ),
        ],
      ),
    );
  }
}
