import 'package:flutter/material.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  _SettingsScreenState createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool emailNotifications = false;
  bool smsNotifications = false;
  bool pushNotifications = false;
  bool twoFactorAuth = false;
  bool passwordRequirements = false;
  bool activityLogging = false;
  bool enableAnalytics = false;

  double motionSensitivity = 0.5;
  String selectedTheme = "Light";
  String selectedLanguage = "English";
  String selectedTimeZone = "UTC";

  final List<String> themes = ["Light", "Dark"];
  final List<String> languages = ["English", "Spanish", "French", "German"];
  final List<String> timeZones = ["UTC", "GMT", "PST", "EST"];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("System Settings"),
        backgroundColor: Colors.blue,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionTitle("🔔 Notification Preferences"),
            _buildToggleSwitch("Email Notifications", emailNotifications,
                (value) => setState(() => emailNotifications = value)),
            _buildToggleSwitch("SMS Notifications", smsNotifications,
                (value) => setState(() => smsNotifications = value)),
            _buildToggleSwitch("Push Notifications", pushNotifications,
                (value) => setState(() => pushNotifications = value)),
            const SizedBox(height: 20),
            _buildSectionTitle("🛡 Security Settings"),
            _buildToggleSwitch("Two-Factor Authentication", twoFactorAuth,
                (value) => setState(() => twoFactorAuth = value)),
            _buildToggleSwitch("Password Requirements", passwordRequirements,
                (value) => setState(() => passwordRequirements = value)),
            _buildToggleSwitch("Activity Logging", activityLogging,
                (value) => setState(() => activityLogging = value)),
            const SizedBox(height: 20),
            _buildSectionTitle("⚙ System Configuration"),
            _buildSlider("Motion Detection Sensitivity", motionSensitivity,
                (value) => setState(() => motionSensitivity = value)),
            _buildDropdown("Data Retention Period",
                ["30 days", "60 days", "90 days"], (value) {}),
            CheckboxListTile(
              title: const Text("Enable Analytics"),
              value: enableAnalytics,
              onChanged: (value) {
                setState(() => enableAnalytics = value!);
              },
            ),
            const SizedBox(height: 20),
            _buildSectionTitle("👤 User Preferences"),
            _buildDropdown("Theme", themes, (value) {
              setState(() => selectedTheme = value!);
            }),
            _buildDropdown("Language", languages, (value) {
              setState(() => selectedLanguage = value!);
            }),
            _buildDropdown("Time Zone", timeZones, (value) {
              setState(() => selectedTimeZone = value!);
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Text(
        title,
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildToggleSwitch(
      String title, bool value, Function(bool) onChanged) {
    return SwitchListTile(
      title: Text(title),
      value: value,
      onChanged: onChanged,
    );
  }

  Widget _buildSlider(String title, double value, Function(double) onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title),
        Slider(
          value: value,
          onChanged: onChanged,
          min: 0,
          max: 1,
          divisions: 10,
          label: "${(value * 10).toInt()}",
        ),
      ],
    );
  }

  Widget _buildDropdown(
      String title, List<String> options, Function(String?) onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title),
        DropdownButton<String>(
          value: options[0],
          isExpanded: true,
          items: options.map((String value) {
            return DropdownMenuItem<String>(
              value: value,
              child: Text(value),
            );
          }).toList(),
          onChanged: onChanged,
        ),
      ],
    );
  }
}
