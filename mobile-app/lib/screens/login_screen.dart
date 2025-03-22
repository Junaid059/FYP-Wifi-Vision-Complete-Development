import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  void dispose() {
    usernameController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          // Left Side - Login Form
          Expanded(
            flex: 5,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 50),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Welcome to WIVI",
                    style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "Your security, our priority",
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                  const SizedBox(height: 20),

                  // Username Input
                  _buildTextField(
                      Icons.person, "Username", usernameController, false),
                  const SizedBox(height: 15),

                  // Password Input
                  _buildTextField(
                      Icons.lock, "Password", passwordController, true),
                  const SizedBox(height: 10),

                  // Forgot Password
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/forgot-password');
                      },
                      child: const Text(
                        "Forgot Password?",
                        style: TextStyle(
                            color: Colors.blue, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Login Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      onPressed: () {
                        String username = usernameController.text.trim();
                        String password = passwordController.text.trim();

                        if (username.isEmpty || password.isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                  "Please enter both username and password"),
                              backgroundColor: Colors.red,
                            ),
                          );
                        } else {
                          Navigator.pushReplacementNamed(context, '/dashboard');
                        }
                      },
                      child:
                          const Text("Login", style: TextStyle(fontSize: 16)),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Social Login Options
                  const Center(child: Text("Or continue with")),
                  const SizedBox(height: 10),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildSocialButton("Google", "assets/google.png"),
                      _buildSocialButton("Facebook", "assets/facebook.png"),
                      _buildSocialButton("GitHub", "assets/github.png"),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Right Side - Blue Background with Information Cards
          Expanded(
            flex: 4,
            child: Container(
              color: const Color(0xFF0056B3), // Darker blue
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Positioned(
                    top: 100,
                    child: _buildInfoCard("WiVi", "Follow us on Social Media"),
                  ),
                  Positioned(
                    top: 250,
                    child: _buildInfoCard("Wifi Vision", "Security"),
                  ),
                  Positioned(
                    bottom: 150,
                    child: _buildInfoCard("Secure Sharing", ""),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Helper function for text fields
  Widget _buildTextField(IconData icon, String hint,
      TextEditingController controller, bool isPassword) {
    return TextField(
      controller: controller,
      obscureText: isPassword,
      decoration: InputDecoration(
        prefixIcon: Icon(icon, color: Colors.grey),
        hintText: hint,
        filled: true,
        fillColor: Colors.grey[200],
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide.none),
      ),
    );
  }

  // Helper function for social login buttons
  Widget _buildSocialButton(String text, String imagePath) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: ElevatedButton.icon(
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.white,
          side: const BorderSide(color: Colors.grey),
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 15),
        ),
        onPressed: () {},
        icon: Image.asset(imagePath, width: 20),
        label: Text(text, style: const TextStyle(color: Colors.black)),
      ),
    );
  }

  // Helper function for information cards on the right panel
  Widget _buildInfoCard(String title, String subtitle) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(title,
              style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white)),
          if (subtitle.isNotEmpty)
            Text(subtitle,
                style: const TextStyle(fontSize: 14, color: Colors.white)),
        ],
      ),
    );
  }
}
