import 'package:flutter/material.dart';
import 'settings_screen.dart';
import 'status_screen.dart';
import 'live_monitoring_screen.dart';
import 'history_screen.dart';

class DashboardScreen extends StatefulWidget {
  final String userName;

  const DashboardScreen({super.key, required this.userName});

  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.security, color: Colors.blueAccent),
            SizedBox(width: 10),
            Text("Wifi Vision", style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          IconButton(icon: const Icon(Icons.notifications), onPressed: () {}),
          IconButton(
              icon: const Icon(Icons.logout),
              onPressed: () => Navigator.pushNamed(context, '/')),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildWelcomeMessage(),
          _buildTabBar(),
          Expanded(child: _buildTabContent()),
        ],
      ),
    );
  }

  Widget _buildWelcomeMessage() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Text(
        "Welcome, ${widget.userName}",
        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildTabBar() {
    return TabBar(
      controller: _tabController,
      indicatorColor: Colors.blueAccent,
      labelColor: Colors.blueAccent,
      unselectedLabelColor: Colors.grey,
      tabs: const [
        Tab(text: "Live"),
        Tab(text: "Heatmaps"),
        Tab(text: "Status"),
        Tab(text: "Settings"),
        Tab(text: "History"),
      ],
    );
  }

  Widget _buildTabContent() {
    return TabBarView(
      controller: _tabController,
      children: [
        const LiveMonitoringScreen(),
        _buildHeatmaps(),
        const StatusScreen(),
        _buildSettings(),
        const HistoryScreen(),
      ],
    );
  }

  Widget _buildHeatmaps() {
    return const Center(child: Text("Heatmaps Visualization (Placeholder)"));
  }

  Widget _buildSettings() {
    return const SettingsScreen();
  }
}
