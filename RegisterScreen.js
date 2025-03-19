import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView,Image } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreenView() {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [inputValidation, setInputValidation] = useState({
    firstName: null,
    lastName: null,
    userName: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  const [errorMessages, setErrorMessages] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(value);
  };

  const validateName = (value) => {
    return /^[a-zA-Z]+$/.test(value);
  };

  const validateField = async (name, value) => {
    let isValid = false;
    let errorMessage = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!validateName(value)) {
          errorMessage = `Use Only alphabtes`;
        } else {
          isValid = true;
        }
        break;
      case "userName":
        if (value.trim().length > 2) {
          const res = await axios.post("http://192.168.190.17:5000/api/check-username", { userName: value });
          isValid = !res.data.exists;
          errorMessage = res.data.exists ? "Username already exists" : "";
        } else {
          errorMessage = "Username must be at least 3 characters long";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) {
          const res = await axios.post("http://192.168.190.17:5000/api/check-email", { email: value });
          isValid = !res.data.exists;
          errorMessage = res.data.exists ? "Email already exists" : "";
        } else {
          errorMessage = "Please enter a valid email address";
        }
        break;
      case "password":
        if (validatePassword(value)) {
          isValid = true;
        } else {
          errorMessage = "Alphanumeric with special characters(more than 6 chars)";
        }
        break;
      case "confirmPassword":
        isValid = value === formData.password;
        break;
      default:
        isValid = value.trim().length > 0;
        break;
    }

    setInputValidation((prev) => ({ ...prev, [name]: isValid }));
    setErrorMessages((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleChange = async (name, value) => {
    setFormData({ ...formData, [name]: value });
    await validateField(name, value);
  };

  const allValid = Object.values(inputValidation).every((val) => val);

  const handleSubmit = async () => {
    try {
      await axios.post("http://192.168.190.17:5000/api/register", formData);
      Alert.alert("Success", "Registration Successful!");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Registration Failed!");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
      <Image source={require("./assets/Logo.png")} style={styles.logo} />
        <Text style={styles.title}>Let's Get Started!</Text>
        <Text style={styles.subtitle}>Create an account on LIGTHS to get all features</Text>

        {["firstName", "lastName", "userName", "email", "password", "confirmPassword"].map((field) => (
          <View key={field} style={{ width: "100%" }}>
            <View
              style={[
                styles.inputContainer,
                inputValidation[field] === true
                  ? styles.validInput
                  : inputValidation[field] === false
                  ? styles.invalidInput
                  : {},
              ]}
            >
              <FontAwesome
                name={field === "email" ? "envelope" : field.toLowerCase().includes("password") ? "lock" : "user"}
                size={20}
                color="#888"
              />
              <TextInput
                placeholder={field === "userName" ? "Username" : field.charAt(0).toUpperCase() + field.slice(1)}
                secureTextEntry={field.toLowerCase().includes("password") && !showPassword}
                style={styles.input}
                onChangeText={(text) => handleChange(field, text)}
                keyboardType={field === "email" ? "email-address" : "default"}
              />
              {field.toLowerCase().includes("password") && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#888" />
                </TouchableOpacity>
              )}
              {inputValidation[field] !== null && (
                <FontAwesome
                  name={inputValidation[field] ? "check-circle" : "times-circle"}
                  size={20}
                  color={inputValidation[field] ? "green" : "red"}
                  style={styles.validationIcon}
                />
              )}
            </View>
            {errorMessages[field] ? <Text style={styles.errorText}>{errorMessages[field]}</Text> : null}
          </View>
        ))}

        <TouchableOpacity style={[styles.button, { opacity: allValid ? 1 : 0.6 }]} onPress={handleSubmit} disabled={!allValid}>
          <Text style={styles.buttonText}>CREATE</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
            Login here
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
    top: -30,
    left:-10,
    width: 250,
    height: 150,
    resizeMode: "contain",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  validInput: { borderWidth: 2, borderColor: "green", shadowColor: "green", shadowRadius: 4, shadowOpacity: 0.8 },
  invalidInput: { borderWidth: 2, borderColor: "red", shadowColor: "red", shadowRadius: 4, shadowOpacity: 0.8 },
  validationIcon: { marginLeft: 10 },
  errorText: { color: "red", fontSize: 12, marginLeft: 5 },
  button: { backgroundColor: "#4B8CA9", width: "100%", padding: 15, alignItems: "center", borderRadius: 10, marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  loginText: { marginTop: 20, color: "#888" },
  loginLink: { color: "#007BFF", fontWeight: "bold" },
});