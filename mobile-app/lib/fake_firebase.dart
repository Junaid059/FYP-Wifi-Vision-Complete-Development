class Firebase {
  static Future<void> initializeApp() async {
    // Fake Firebase Initialization for Windows (Does nothing)
  }
}

class UserCredential {
  final FakeUser? user;
  UserCredential({this.user});
}

class FakeUser {
  final String? email;
  FakeUser({this.email});
}

class FirebaseAuth {
  static final FirebaseAuth instance = FirebaseAuth();

  Future<UserCredential> signInWithEmailAndPassword(
      {String? email, String? password}) async {
    print("Fake Firebase Auth: Login bypassed on Windows.");
    return UserCredential(user: FakeUser(email: email));
  }

  Future<UserCredential> createUserWithEmailAndPassword(
      {String? email, String? password}) async {
    print("Fake Firebase Auth: Signup bypassed on Windows.");
    return UserCredential(user: FakeUser(email: email));
  }

  Future<void> sendPasswordResetEmail({required String email}) async {
    print("Fake Firebase Auth: Password reset bypassed on Windows.");
  }
}
