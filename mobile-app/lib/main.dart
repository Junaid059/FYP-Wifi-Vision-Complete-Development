import 'package:flutter/material.dart';
import 'dart:io' show Platform;
import 'package:firebase_core/firebase_core.dart'
    if (dart.library.io) 'fake_firebase.dart';

import 'screens/login_screen.dart';
import 'screens/forgot_password_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/heatmap_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/status_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase only if not running on Windows
  if (!Platform.isWindows) {
    try {
      await Firebase.initializeApp();
    } catch (e) {
      print("Skipping Firebase Initialization on Windows: $e");
    }
  }

  runApp(const WiViApp());
}

class WiViApp extends StatefulWidget {
  const WiViApp({super.key});

  @override
  _WiViAppState createState() => _WiViAppState();
}

class _WiViAppState extends State<WiViApp> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: Colors.white,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const LoginScreen(), // Default login screen
        '/forgot-password': (context) =>
            const ForgotPasswordScreen(), // Forgot password
        '/heatmaps': (context) => const HeatmapScreen(), // Heatmaps screen
        '/settings': (context) => const SettingsScreen(), // Settings screen
        '/status': (context) => const StatusScreen(), // Status screen
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/dashboard') {
          final args = settings.arguments as Map<String, dynamic>?;

          return MaterialPageRoute(
            builder: (context) =>
                DashboardScreen(userName: args?['userName'] ?? "User"),
          );
        }

        return null; // If route is not defined, return null
      },
    );
  }
}
