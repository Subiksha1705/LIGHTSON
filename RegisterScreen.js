import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
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
    country: "",
    age: "",
    retirementAge: "",
    phoneNumber: "",
  });

  const [inputValidation, setInputValidation] = useState({
    firstName: false,
    lastName: false,
    userName: false,
    email: false,
    password: false,
    confirmPassword: false,
    country: false,
    age: false,
    retirementAge: false,
    phoneNumber: false,
  });

  const [errorMessages, setErrorMessages] = useState({});
  const [showPassword, setShowPassword] = useState(false);

 const NGROK_URL = `${process.env.REACT_APP_API_BASE_URL}/api/`;

  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(value);
  };

  const validateName = (value) => /^[a-zA-Z]+$/.test(value);

  const validateField = async (name, value) => {
    let isValid = false;
    let errorMessage = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!validateName(value)) {
          errorMessage = `Use only alphabets`;
        } else {
          isValid = true;
        }
        break;

      case "userName":
        if (value.trim().length > 2) {
          const res = await axios.post(`${NGROK_URL}/api/check-username`, { userName: value });
          isValid = !res.data.exists;
          errorMessage = res.data.exists ? "Username already exists" : "";
        } else {
          errorMessage = "Username must be at least 3 characters long";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) {
          const res = await axios.post(`${NGROK_URL}/api/check-email`, { email: value });
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
          errorMessage = "Alphanumeric with special characters (8+ chars)";
        }
        break;

      case "confirmPassword":
        isValid = value === formData.password;
        errorMessage = isValid ? "" : "Passwords do not match";
        break;

      case "age":
        const ageValue = parseInt(value);
        if (!isNaN(ageValue) && ageValue >= 18 && ageValue <= 99) {
          isValid = true;
        } else {
          errorMessage = "Age must be between 18 and 99";
        }
        break;

      case "retirementAge":
        const retirementAgeValue = parseInt(value);
        const currentAge = parseInt(formData.age);
        if (!currentAge || isNaN(currentAge)) {
          errorMessage = "Please enter your current age first";
        } else if (!isNaN(retirementAgeValue) && retirementAgeValue > currentAge) {
          isValid = true;
        } else {
          errorMessage = "Retirement age must be greater than your current age";
        }
        break;

      case "phoneNumber":
        const phoneRegex = /^[0-9]{10}$/;
        isValid = phoneRegex.test(value);
        errorMessage = isValid ? "" : "Enter a valid 10-digit phone number";
        break;

      case "country":
        isValid = value.trim().length > 0;
        errorMessage = isValid ? "" : "Please select a country";
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

  const handleSubmit = async () => {
    const allFields = Object.keys(formData);
    await Promise.all(allFields.map((field) => validateField(field, formData[field])));

    if (!Object.values(inputValidation).every((val) => val)) {
      Alert.alert("Error", "Please fix all validation errors before submitting.");
      return;
    }

    try {
      await axios.post(`${NGROK_URL}/api/register`, { ...formData });
      Alert.alert("Success", "Registration Successful!");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Registration Failed!");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={require("./assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Let's Get Started!</Text>
        <Text style={styles.subtitle}>Create an account on LIGHTS to get all features</Text>

        {/* Form Inputs */}
        {Object.keys(formData).map((field) => (
  <View key={field} style={{ width: "100%" }}>
    {field === "country" ? (
      <Picker
        selectedValue={formData.country}
        onValueChange={(value) => handleChange(field, value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Country" value="" />
        <Picker.Item label="India" value="India" />
        <Picker.Item label="USA" value="USA" />
        <Picker.Item label="UK" value="UK" />
        <Picker.Item label="Canada" value="Canada" />
      </Picker>
    ) : (
      <View style={field.toLowerCase().includes("password") ? styles.passwordContainer : null}>
        <TextInput
          placeholder={field === "userName" ? "Username" : field.charAt(0).toUpperCase() + field.slice(1)}
          secureTextEntry={field.toLowerCase().includes("password") && !showPassword}
          style={[styles.input, field.toLowerCase().includes("password") ? styles.passwordInput : null]}
          onChangeText={(text) => handleChange(field, text)}
          keyboardType={["age", "phoneNumber", "retirementAge"].includes(field) ? "numeric" : "default"}
        />
        {field.toLowerCase().includes("password") && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>
    )}
    {errorMessages[field] ? <Text style={styles.errorText}>{errorMessages[field]}</Text> : null}
  </View>
))}

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 250,
    height: 150,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
  },
  picker: {
    width: "100%",
    height: 50,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4B8CA9",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    
    marginBottom: 0,
    width: "100%",
     // Add padding for the eye icon
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  eyeIcon: {
    padding: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
