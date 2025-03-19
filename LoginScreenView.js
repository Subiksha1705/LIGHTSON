import React, { useState } from "react";
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
  Alert, // Import the Alert component
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

export default function LoginScreenView({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://192.168.190.17:5000/api/login", {
        userName: username,
        password: password,
      });

      // If login is successful, display the alert
      Alert.alert(
        "Login Successful",
        "Welcome back to your account!", // Message you want to show
        [{ text: "OK"}], // Button to navigate
        { cancelable: false }
      );

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Logo */}
        <Image source={require("./assets/Logo.png")} style={styles.logo} />

        {/* Title */}
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Log in to existing LIGTHS account</Text>

        {/* Username Input */}
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

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#888" />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Error Message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Log In Button */}
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

        {/* Social Login */}
        <Text style={styles.orText}>Or sign up using</Text>
        <View style={styles.socialIcons}>
          <FontAwesome name="facebook" size={40} color="#3b5998" />
          <FontAwesome name="google" size={40} color="#db4437" />
          <FontAwesome name="apple" size={40} color="#000" />
        </View>

        {/* Sign-Up Prompt */}
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