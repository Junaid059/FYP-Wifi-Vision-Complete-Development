import 'package:flutter/material.dart';

class NotificationScreen extends StatelessWidget {
  final List<Map<String, String>> notifications = [
    {
      "title": "New Alert",
      "message": "A new device has connected to the network."
    },
    {"title": "Update Available", "message": "A new firmware update is ready."},
    {
      "title": "Security Warning",
      "message": "Unusual activity detected on your network."
    },
    {
      "title": "Reminder",
      "message": "Schedule your network maintenance check."
    },
    {"title": "User Login", "message": "Admin logged in from a new device."},
  ];

  NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: const Text("Notifications")),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: notifications.length,
        itemBuilder: (context, index) {
          return _buildNotificationCard(notifications[index]);
        },
      ),
    );
  }

  Widget _buildNotificationCard(Map<String, String> notification) {
    return Card(
      margin: const EdgeInsets.only(bottom: 15),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        leading: const Icon(Icons.notifications, color: Colors.blueAccent),
        title: Text(notification["title"]!,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        subtitle: Text(notification["message"]!),
      ),
    );
  }
}
