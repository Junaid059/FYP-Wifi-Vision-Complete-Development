import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class StatusScreen extends StatelessWidget {
  const StatusScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "System Status",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildStatusCard(
                    "Operational",
                    "12",
                    "Systems running smoothly",
                    Colors.green.shade100,
                    Colors.green),
                _buildStatusCard("Warnings", "3", "Require attention",
                    Colors.yellow.shade100, Colors.orange),
                _buildStatusCard("Critical Issues", "1",
                    "Immediate action needed", Colors.red.shade100, Colors.red),
              ],
            ),
            const SizedBox(height: 20),
            const Text(
              "System Health",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            _buildHealthBar("CPU Usage", 99, Colors.red),
            _buildHealthBar("Memory Usage", 42, Colors.orange),
            _buildHealthBar("Network Usage", 67, Colors.blue),
            const SizedBox(height: 20),
            const Text(
              "System Metrics Over Time",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            _buildLineChart(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusCard(String title, String value, String subtitle,
      Color bgColor, Color iconColor) {
    return Container(
      width: 110, // Adjust width if needed
      height: 110, // Increased height to prevent text overflow
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.info_outline, color: iconColor),
          const SizedBox(height: 5),
          Text(title,
              style:
                  const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
          Text(value,
              style: TextStyle(
                  fontSize: 16, fontWeight: FontWeight.bold, color: iconColor)),
          Flexible(
            child: Text(
              subtitle,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, color: Colors.black54),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHealthBar(String title, int value, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        children: [
          Expanded(flex: 2, child: Text(title)),
          Expanded(
            flex: 5,
            child: Stack(
              children: [
                Container(
                    height: 10,
                    decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(5))),
                FractionallySizedBox(
                  widthFactor: value / 100,
                  child: Container(
                      height: 10,
                      decoration: BoxDecoration(
                          color: color,
                          borderRadius: BorderRadius.circular(5))),
                ),
              ],
            ),
          ),
          const SizedBox(width: 5),
          Text("$value%"),
        ],
      ),
    );
  }

  Widget _buildLineChart() {
    return SizedBox(
      height: 200, // Adjust height to avoid overflow
      child: LineChart(
        LineChartData(
          gridData: const FlGridData(show: true),
          titlesData: const FlTitlesData(
            leftTitles: AxisTitles(
              sideTitles: SideTitles(showTitles: true, reservedSize: 40),
            ),
            bottomTitles: AxisTitles(
              sideTitles: SideTitles(showTitles: true, reservedSize: 20),
            ),
          ),
          borderData: FlBorderData(show: true),
          lineBarsData: [
            LineChartBarData(
              spots: [
                const FlSpot(0, 50),
                const FlSpot(1, 70),
                const FlSpot(2, 40),
                const FlSpot(3, 85),
                const FlSpot(4, 60),
                const FlSpot(5, 90),
              ],
              isCurved: true,
              barWidth: 3,
              color: Colors.red,
              dotData: const FlDotData(show: true),
            ),
            LineChartBarData(
              spots: [
                const FlSpot(0, 30),
                const FlSpot(1, 50),
                const FlSpot(2, 60),
                const FlSpot(3, 70),
                const FlSpot(4, 90),
                const FlSpot(5, 80),
              ],
              isCurved: true,
              barWidth: 3,
              color: Colors.blue,
              dotData: const FlDotData(show: true),
            ),
            LineChartBarData(
              spots: [
                const FlSpot(0, 40),
                const FlSpot(1, 60),
                const FlSpot(2, 75),
                const FlSpot(3, 50),
                const FlSpot(4, 80),
                const FlSpot(5, 65),
              ],
              isCurved: true,
              barWidth: 3,
              color: Colors.green,
              dotData: const FlDotData(show: true),
            ),
          ],
        ),
      ),
    );
  }
}
