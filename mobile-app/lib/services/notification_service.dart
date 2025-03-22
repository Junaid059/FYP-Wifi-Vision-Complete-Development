import 'dart:io' show Platform;
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
//import 'package:flutter/material.dart';

// Prevent import errors on Windows
import 'package:firebase_messaging/firebase_messaging.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  static final FlutterLocalNotificationsPlugin
      _flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();

  static Future<void> init() async {
    if (Platform.isAndroid || Platform.isIOS) {
      await _initFirebaseNotifications();
    } else {
      print("Notifications are not supported on Windows.");
    }
  }

  /// Initialize Firebase Cloud Messaging (FCM) for Mobile
  static Future<void> _initFirebaseNotifications() async {
    FirebaseMessaging messaging = FirebaseMessaging.instance;

    // Request permission for notifications
    NotificationSettings settings = await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      print("User granted permission for notifications.");
    } else {
      print("User denied notifications.");
      return;
    }

    // Get the FCM Token
    String? token = await messaging.getToken();
    print("FCM Token: $token");

    // Handle foreground notifications
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print("New Notification: ${message.notification?.title}");
      _showLocalNotification(message);
    });

    // Initialize local notifications for mobile
    await _initLocalNotifications();
  }

  /// Initialize Local Notifications
  static Future<void> _initLocalNotifications() async {
    const AndroidInitializationSettings androidInitSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const InitializationSettings initSettings =
        InitializationSettings(android: androidInitSettings);

    await _flutterLocalNotificationsPlugin.initialize(initSettings);
  }

  /// Show Local Notification when a push notification is received
  static void _showLocalNotification(RemoteMessage message) {
    const AndroidNotificationDetails androidPlatformChannelSpecifics =
        AndroidNotificationDetails(
      'channel_id',
      'channel_name',
      importance: Importance.max,
      priority: Priority.high,
    );

    const NotificationDetails platformChannelSpecifics =
        NotificationDetails(android: androidPlatformChannelSpecifics);

    _flutterLocalNotificationsPlugin.show(
      0,
      message.notification?.title ?? "No Title",
      message.notification?.body ?? "No Body",
      platformChannelSpecifics,
    );
  }
}
