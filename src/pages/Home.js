import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { React, useContext, useState } from "react";
import AuthContext from "../context/firebaseContext/AuthContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import theme from "../theme";
const Stack = createNativeStackNavigator();
export default function Home({ navigation }) {
  const { logOut } = useContext(AuthContext);

  const logout = () => {
    logOut().then(() => navigation.navigate("Login"));
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View>
        <Text>Hola mundo</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
