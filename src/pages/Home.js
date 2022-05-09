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
import StyledTouchableHighlight from "../components/StyledTouchableHighlight";
import Alarma from "../components/componentesEspecificos/Alarma";
const Stack = createNativeStackNavigator();
export default function Home({ navigation }) {
  const { logOut } = useContext(AuthContext);
  const [alarma, setAlarma] = useState(false);
  const logout = () => {
    logOut().then(() => navigation.navigate("Login"));
  };
  const handleActivarAlarma = () => {
    setAlarma(true);
  };
  const handlerDesactivar = () => {
    setAlarma(false);
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      {alarma ? (
        <>
          <Alarma onDesactivar={handlerDesactivar}></Alarma>
        </>
      ) : (
        <>
          <View style={styles.container}>
            <StyledTouchableHighlight btnVotar onPress={handleActivarAlarma}>
              Activar alarma!
            </StyledTouchableHighlight>
            <StyledTouchableHighlight btnLogout onPress={logout}>
              Cerrar Sesión
            </StyledTouchableHighlight>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colores.primary,
  },
});
