import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreenView({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (userInfo) {
        console.log("✅ User already logged in:", JSON.parse(userInfo));
        navigation.navigate("MainApp", {
          screen: "Calendar",
          params: { screen: "CalendarMain" },
        });
      }
    };
    checkLoginStatus();
  }, []);

  // Handle login function
  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
  const response = await axios.post(
    `${API_URL}/api/login`,
    {
      userName: username,
      password: password,
    }
  );

      if (response.data) {
        console.log("✅ Login Successful:", response.data);

        // Store user info in AsyncStorage
        await AsyncStorage.setItem("userInfo", JSON.stringify(response.data));

        Alert.alert("Login Success", "Redirecting to CalendarMain...");
        navigation.navigate("MainApp", {
          screen: "Calendar",
          params: { screen: "CalendarMain" },
        });
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("❌ Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userInfo");
      console.log("🚪 User logged out successfully!");
      Alert.alert("Logged Out", "You have been logged out successfully.");
      navigation.navigate("Login");
    } catch (err) {
      console.error("❌ Error during logout:", err);
    }
  };

  // Retrieve user info
  const getUserInfo = async () => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (userInfo !== null) {
        console.log("👤 Retrieved User Info:", JSON.parse(userInfo));
      }
    } catch (err) {
      console.error("❌ Error retrieving user info:", err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={require("./assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Log in to your LIGHTS account</Text>

        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="#888" />
          <TextInput
            placeholder="Username"
            style={styles.input}
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#888" />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry={!showPassword} // Toggle visibility
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>LOG IN</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>Or sign up using</Text>
        <View style={styles.socialIcons}>
          <FontAwesome name="facebook" size={40} color="#3b5998" />
          <FontAwesome name="google" size={40} color="#db4437" />
          <FontAwesome name="apple" size={40} color="#000" />
        </View>

        <Text style={styles.signupText}>
          Don’t have an account?{" "}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate("SignUp")}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  logo: {
    top: 140,
    width: 250,
    height: 150,
    resizeMode: "contain",
  },
  title: {
    marginTop: 150,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#888",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    padding: 5,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#007BFF",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#4B8CA9",
    width: "100%",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "#d9534f",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  orText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginBottom: 30,
  },
  signupText: {
    fontSize: 14,
    color: "#888",
  },
  signupLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});