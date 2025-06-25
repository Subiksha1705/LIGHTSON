import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ProfilePage = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🌐 Fetch profile from backend
  const fetchProfile = async () => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (!userInfo) {
        alert("User not logged in. Please log in again.");
        navigation.replace("Login"); // Redirect to login page
        return;
      }

      const parsedInfo = JSON.parse(userInfo);
      if (!parsedInfo?.user?.username && !parsedInfo?.user?.userName) {
        alert("Invalid user data. Please log in again.");
        navigation.replace("Login");
        return;
      }

      const username = parsedInfo.user.username || parsedInfo.user.userName;
     const apiUrl = `${process.env.REACT_APP_API_URL}/profile/${username}`;

      console.log(`Fetching profile for: ${username}`);
      const response = await axios.get(apiUrl);
      setProfile(response.data);
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      setError("Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔒 Sign-out function
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("userInfo");
      alert("Signed out successfully!");
      navigation.replace("Login"); // Redirect to login screen
    } catch (err) {
      console.error("❌ Error signing out:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>👤 Profile Information</Text>
      <ProfileDetail label="First Name" value={profile.firstName} />
      <ProfileDetail label="Last Name" value={profile.lastName} />
      <ProfileDetail label="Username" value={profile.userName} />
      <ProfileDetail label="Email" value={profile.email} />
      <ProfileDetail label="Age" value={profile.age?.toString()} />
      <ProfileDetail
        label="Retirement Age"
        value={profile.retirementAge?.toString()}
      />
      <ProfileDetail label="Phone Number" value={profile.phoneNumber} />
      <ProfileDetail label="Country" value={profile.country} />

      {/* 🚪 Sign-out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// 📌 Profile Detail Component
const ProfileDetail = ({ label, value }) => (
  <View style={styles.detailContainer}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || "N/A"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5F5",
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  detailContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  value: {
    fontSize: 16,
    marginTop: 5,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  signOutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfilePage;
