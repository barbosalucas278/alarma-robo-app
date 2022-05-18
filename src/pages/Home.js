import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableHighlight,
  ActivityIndicator,
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
  const [spinner, setSpinner] = useState(false);
  const { logOut } = useContext(AuthContext);
  const [alarma, setAlarma] = useState(false);
  const logout = () => {
    logOut().then(() => navigation.navigate("Login"));
  };
  const handleActivarAlarma = () => {
    setSpinner(true);
    setTimeout(() => {
      setSpinner(false);
      setAlarma(true);
    }, 2000);
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
          {spinner ? (
            <View style={styles.container}>
              <ActivityIndicator size={180} color={theme.colores.details} />
            </View>
          ) : (
            <>
              <View style={styles.container}>
                <TouchableHighlight onPress={handleActivarAlarma}>
                  <View style={styles.btnActivarAlarma}>
                    <Image
                      resizeMode="contain"
                      style={{ width: 100, height: 100 }}
                      source={require("../../assets/icon.png")}
                    ></Image>
                    <Text
                      style={{
                        fontFamily: theme.font.main,
                        fontSize: theme.fontSizes.subHeading,
                        color: "white",
                      }}
                    >
                      Activar alarma!
                    </Text>
                  </View>
                </TouchableHighlight>
                <View
                  style={{
                    right: Dimensions.get("screen").width * 0.25,
                    top: Dimensions.get("screen").height * 0.2,
                  }}
                >
                  <StyledTouchableHighlight btnLogout onPress={logout}>
                    Cerrar Sesión
                  </StyledTouchableHighlight>
                </View>
              </View>
            </>
          )}
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
  btnActivarAlarma: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.4,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
});
