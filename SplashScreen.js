import { Image, StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
import Logo from "./assets/Logo.png";
import Splash from "./assets/splash.png";

export default function SplashScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Image source={Splash} style={styles.splash} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>GET STARTED</Text>
        
      </TouchableOpacity>
      <Text style={styles.title}>
        <Text style={styles.firstLetter}>L</Text>earn,{" "}
        <Text style={styles.greenLetter}>I</Text>nvest &{"\n"}
        <Text style={styles.firstLetter}>G</Text>row{" "}
        <Text style={styles.redLetter}>T</Text>owards{" "}
        <Text style={styles.firstLetter}>H</Text>eavenly{" "}
        <Text style={styles.firstLetter}>S</Text>uccess
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Roboto_400Regular",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    position: "absolute",
    top: 50,
    width: 250,
    height: 150,
    resizeMode: "contain",
    zIndex: 1,
  },
  splash: {
    marginTop: -250,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#ffff",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderWidth:2,
    borderRadius: 15,
    borderColor:"#4B8CA9",
  },
  buttonText: {
    color: "#4B8CA9",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontWeight:"bold",
    fontSize: 24,
    color: "#515151", 
    textAlign: "center",
    marginVertical: 20,
    marginTop:30,
  },
  firstLetter: {
    color: "#4B8CA9", 
  },
  greenLetter: {
    color:"#34A853",
  },
  redLetter:{
    color: "#EB4335",
  }
});