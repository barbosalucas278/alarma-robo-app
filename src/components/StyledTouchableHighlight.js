import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import React from "react";
import theme from "../theme";
export default function StyledTouchableHighlight({
  children,
  onPress,
  color,
  btnLogin,
  btnVotar,
  btnLogout,
  style,
  ...restOfProps
}) {
  const btnStyles = [
    styles.btn,
    color == "secondary" && styles.secondary,
    color == "primary" && styles.primary,
    btnLogin && styles.btnLogin,
    btnVotar && styles.btnVotar,
    btnLogout && styles.btnLogout,
    style,
  ];
  return (
    <TouchableHighlight onPress={onPress} {...restOfProps}>
      <View style={btnStyles}>
        <Text
          style={[
            { fontFamily: theme.font.main },
            btnVotar && styles.textVotar,
            btnLogout && styles.textVotar,
          ]}
        >
          {children}
        </Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  btn: {
    justifyContent: "center",
    alignItems: "center",
  },
  btnLogin: {
    paddingVertical: 15,
    paddingHorizontal:
      Dimensions.get("screen").width / 2 - Dimensions.get("screen").width / 3,
    borderRadius: 10,
  },
  btnVotar: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 20,
    backgroundColor: "green",
  },
  btnLogout: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "white",
    backgroundColor: "red",
  },
  textVotar: {
    color: "white",
  },
  secondary: {
    color: "#fefefe",
    backgroundColor: theme.colores.secondary,
  },
  primary: {
    color: "#fff",
    backgroundColor: theme.colores.detaile2,
  },
});
