import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, Modal } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import TextInputMask from "react-native-text-input-mask";
import { Picker } from "@react-native-picker/picker"; 
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
    retirementAge: "",
    dateOfBirth: "",
    phoneNumber: "",
  });

  const [inputValidation, setInputValidation] = useState({
    firstName: null,
    lastName: null,
    userName: null,
    email: null,
    password: null,
    confirmPassword: null,
    country: null,
    retirementAge: null,
    dateOfBirth: null,
    phoneNumber: null,
  });

  const [errorMessages, setErrorMessages] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [age, setAge] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  
  const NGROK_URL = "https://f7b6-2401-4900-925b-fa6-498f-8d92-322-62a6.ngrok-free.app"; 

  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(value);
  };

  const validateName = (value) => /^[a-zA-Z]+$/.test(value);

  const calculateAge = (dob) => {
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      return age - 1;
    }
    return age;
  };

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
          errorMessage = "Alphanumeric with special characters (more than 6 chars)";
        }
        break;
      case "confirmPassword":
        isValid = value === formData.password;
        errorMessage = isValid ? "" : "Passwords do not match";
        break;
        case "dateOfBirth":
          const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/; // Regex to validate dd/mm/yyyy format
          if (dateRegex.test(value)) {
            const [_, day, month, year] = value.match(dateRegex);
            const dob = new Date(`${year}-${month}-${day}`);
            const calculatedAge = calculateAge(dob);
        
            if (calculatedAge >= 18) {
              isValid = true;
              setAge(calculatedAge);
            } else {
              errorMessage = "You must be at least 18 years old";
            }
          } else {
            errorMessage = "Enter a valid date in dd/mm/yyyy format";
          }
          break;
      case "phoneNumber":
        const phoneRegex = /^[0-9]{10}$/;
        isValid = phoneRegex.test(value);
        errorMessage = isValid ? "" : "Enter a valid 10-digit phone number";
        break;
      case "retirementAge":
        isValid = parseInt(value) > age;
        errorMessage = isValid ? "" : "Retirement age must be greater than your current age";
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

  const handleSendOtp = async () => {
    try {
      await axios.post(`${NGROK_URL}/send-otp`, { email: formData.email });
      setOtpSent(true);
      Alert.alert("OTP Sent", "Please check your email for the OTP.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${NGROK_URL}/verify-otp`, { email: formData.email, otp });
      if (res.data.message === "OTP verified, user registered successfully") {
        handleSubmit();
      } else {
        Alert.alert("Error", "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${NGROK_URL}/api/register`, { ...formData, age });
      Alert.alert("Success", "Registration Successful!");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Registration Failed!");
    }
  };

  const allValid = Object.values(inputValidation).every((val) => val);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require("./assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Let's Get Started!</Text>
        <Text style={styles.subtitle}>Create an account on LIGTHS to get all features</Text>

        {["firstName", "lastName", "userName", "email", "password", "confirmPassword", "phoneNumber", "retirementAge"].map((field) => (
          <View key={field} style={{ width: "100%" }}>
            <View
              style={[
                styles.inputContainer,
                inputValidation[field] === true ? styles.validInput : inputValidation[field] === false ? styles.invalidInput : {},
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
                keyboardType={field === "email" ? "email-address" : field === "phoneNumber" ? "numeric" : "default"}
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

       {/* Date of Birth Field */}
       import TextInputMask from "react-native-text-input-mask";

{/* Date of Birth Field with Mask */}
<View style={{ width: "100%" }}>
  <View
    style={[
      styles.inputContainer,
      inputValidation["dateOfBirth"] === true ? styles.validInput : inputValidation["dateOfBirth"] === false ? styles.invalidInput : {},
    ]}
  >
    <FontAwesome name="calendar" size={20} color="#888" />
    <TextInputMask
      placeholder="Enter Date of Birth (dd/mm/yyyy)"
      style={styles.input}
      onChangeText={(formatted, extracted) => handleChange("dateOfBirth", formatted)}
      mask={"[00]/[00]/[0000]"} // Mask for dd/mm/yyyy format
    />
    {inputValidation["dateOfBirth"] !== null && (
      <FontAwesome
        name={inputValidation["dateOfBirth"] ? "check-circle" : "times-circle"}
        size={20}
        color={inputValidation["dateOfBirth"] ? "green" : "red"}
        style={styles.validationIcon}
      />
    )}
  </View>
  {errorMessages["dateOfBirth"] ? <Text style={styles.errorText}>{errorMessages["dateOfBirth"]}</Text> : null}
</View>
        {/* Country Dropdown */}
        <View style={{ width: "100%" }}>
          <View
            style={[
              styles.inputContainer,
              inputValidation["country"] === true ? styles.validInput : inputValidation["country"] === false ? styles.invalidInput : {},
            ]}
          >
            <Picker
              selectedValue={formData.country}
              onValueChange={(value) => handleChange("country", value)}
              style={{ flex: 1 }}
            >
              <Picker.Item label="Select Country" value="" />
              <Picker.Item label="United States" value="United States" />
              <Picker.Item label="India" value="India" />
              <Picker.Item label="United Kingdom" value="United Kingdom" />
              <Picker.Item label="Canada" value="Canada" />
              <Picker.Item label="Australia" value="Australia" />
              {/* Add more countries as needed */}
            </Picker>

            {inputValidation["country"] !== null && (
              <FontAwesome
                name={inputValidation["country"] ? "check-circle" : "times-circle"}
                size={20}
                color={inputValidation["country"] ? "green" : "red"}
                style={styles.validationIcon}
              />
            )}
          </View>
          {errorMessages["country"] ? <Text style={styles.errorText}>{errorMessages["country"]}</Text> : null}
        </View>

        {!otpSent ? (
          <TouchableOpacity style={[styles.button, { opacity: inputValidation.email ? 1 : 0.6 }]} onPress={handleSendOtp} disabled={!inputValidation.email}>
            <Text style={styles.buttonText}>SEND OTP</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              placeholder="Enter OTP"
              style={[styles.input, styles.otpInput]}
              onChangeText={(text) => setOtp(text)}
              keyboardType="numeric"
            />
            <TouchableOpacity style={[styles.button, { opacity: otp ? 1 : 0.6 }]} onPress={handleVerifyOtp} disabled={!otp}>
              <Text style={styles.buttonText}>VERIFY OTP</Text>
            </TouchableOpacity>
          </>
        )}

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
    left: -10,
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
  validInput: { borderWidth: 2, borderColor: "green" },
  invalidInput: { borderWidth: 2, borderColor: "red" },
  validationIcon: { marginLeft: 10 },
  errorText: { color: "red", fontSize: 12, marginLeft: 5 },
  button: { backgroundColor: "#4B8CA9", width: "100%", padding: 15, alignItems: "center", borderRadius: 10, marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  loginText: { marginTop: 20, color: "#888" },
  loginLink: { color: "#007BFF", fontWeight: "bold" },
  otpInput: { marginTop: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, width: "100%" },
});