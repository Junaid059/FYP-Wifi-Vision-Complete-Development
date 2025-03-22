import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = "http://your-flask-api-url.com";

  static Future<Map<String, dynamic>> fetchData() async {
    final response = await http.get(Uri.parse("$baseUrl/realtime-monitoring"));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception("Failed to load data");
    }
  }
}
