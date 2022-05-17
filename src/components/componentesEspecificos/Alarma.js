import {
  StyleSheet,
  Text,
  View,
  Vibration,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import React, { useState, useEffect, useRef } from "react";
import { Accelerometer, Magnetometer } from "expo-sensors";
import StyledText from "../StyledText";
import { Sound } from "expo-av/build/Audio";
import StyledTouchableHighlight from "../StyledTouchableHighlight";
import StyledTextInput from "../StyledTextInput";
import { getUsuarioByEmail } from "../../services/FirestoreServices";
import { auth } from "../../../firebase";
import theme from "../../theme";

export default function Alarma(props) {
  const [armado, setArmado] = useState(true);
  const [password, setPassword] = useState("");
  const [error, showError] = useState(false);
  const [alarmaActivada, setAlarmaActivada] = useState(false);
  const camaraRef = useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [showFlash, setShowFlash] = useState(false);
  const [alarmaHorizontal, setAlarmaHorizontal] = useState(false); // x > 90 && y < 10 || x < -90 && y < 10
  const [timerHorizontal, setTimerHorizontal] = useState();
  const [alarmaVertical, setAlarmaVertical] = useState(false);
  const [timerVertical, setTimerVertical] = useState();
  const [alarmaDerecha, setalarmaDerecha] = useState(false);
  const [timerDerecha, setTimerDerecha] = useState();
  const [alarmaIzquierda, setalarmaIzquierda] = useState(false);
  const [timerIzquierda, setTimerIzquierda] = useState();
  const [dataAcelerometro, setDataAcelerometro] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [dataMagnometro, setDataMagnometro] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [dataPreviaMagnometro, setDataPreviaMagnometro] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const { x, y, z } = dataMagnometro;
  const [subscriptionAcelerometro, setAcelerometroSubscription] =
    useState(null);
  const [subscriptionMagnometro, setMagnometroSubscription] = useState(null);

  const _subscribeAcelerometro = () => {
    setAcelerometroSubscription(
      Accelerometer.addListener((accelerometerData) => {
        setDataAcelerometro(accelerometerData);
      })
    );
    Accelerometer.setUpdateInterval(250);
  };
  const _subscribeMagnometro = () => {
    setMagnometroSubscription(
      Magnetometer.addListener((result) => {
        setDataMagnometro(result);
      })
    );
    Magnetometer.setUpdateInterval(250);
  };
  const _unsubscribeAcelerometro = () => {
    subscriptionAcelerometro && subscriptionAcelerometro.remove();
    setAcelerometroSubscription(null);
  };
  const _unsubscribeMagnometro = () => {
    subscriptionMagnometro && subscriptionMagnometro.remove();
    setMagnometroSubscription(null);
  };

  //useEffect que controla la suscripcion a los device dle celular
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    _subscribeAcelerometro();
    _subscribeMagnometro();
    return () => {
      _unsubscribeAcelerometro();
      _unsubscribeMagnometro();
    };
  }, []);

  //useEffect que controla los datos del acelerometro
  useEffect(() => {
    if (alarmaVertical || alarmaHorizontal || alarmaDerecha || alarmaIzquierda)
      return;
    if (!armado) return;

    const posicionX = Math.round(dataAcelerometro.x * 100);
    const posicionY = Math.round(dataAcelerometro.y * 100);
    const posicionZ = Math.round(dataAcelerometro.z * 100);
    if (
      (posicionX > 80 && posicionY < 20 && posicionZ <= 70) ||
      (posicionX < -80 && posicionY < 20 && posicionZ <= 70)
    ) {
      setAlarmaActivada(true);

      if (alarmaActivada) {
        setAlarmaHorizontal(true);
        setTimerHorizontal(
          setInterval(() => {
            Sound.createAsync(
              require("../../../assets/audios/alarma1.wav")
            ).then(({ sound }) => {
              Vibration.vibrate(5000);
              sound.playAsync();
            });
          }, 6000)
        );
      }
    }

    if (
      (posicionX < 20 && posicionY > 80) ||
      (posicionX < 20 && posicionY < -80)
    ) {
      setAlarmaActivada(true);

      if (alarmaActivada) {
        setAlarmaVertical(true);
        setTimerVertical(
          setInterval(() => {
            Sound.createAsync(
              require("../../../assets/audios/alarma2.wav")
            ).then(({ sound }) => {
              prenderFlashAsync();
              sound.playAsync();
            });
          }, 6000)
        );
      }
    }
  }, [dataAcelerometro.x, dataAcelerometro.y, alarmaActivada]);

  const prenderFlashAsync = () => {
    setShowFlash(true);
    setTimeout(() => {
      setShowFlash(false);
    }, 5000);
  };
  //useEffect que controla los datos del magnometro

  useEffect(() => {
    if (alarmaVertical || alarmaHorizontal || alarmaDerecha || alarmaIzquierda)
      return;
    if (!armado) return;
    if (dataPreviaMagnometro.x == 0) {
      setDataPreviaMagnometro(dataMagnometro);
    }
    const posicionX = dataPreviaMagnometro.x - dataMagnometro.x;
    const posicionZ = dataMagnometro.z;

    if (posicionX >= 4 && posicionZ > 15) {
      setAlarmaActivada(true);

      if (alarmaActivada) {
        setalarmaDerecha(true);
        setTimerDerecha(
          setInterval(() => {
            Sound.createAsync(
              require("../../../assets/audios/alarma3.wav")
            ).then(({ sound }) => {
              sound.playAsync();
            });
          }, 3000)
        );
      }
    }

    if (posicionX <= -4 && posicionZ > 15) {
      setAlarmaActivada(true);

      if (alarmaActivada) {
        setalarmaIzquierda(true);
        setTimerIzquierda(
          setInterval(() => {
            Sound.createAsync(
              require("../../../assets/audios/alarma4.wav")
            ).then(({ sound }) => {
              sound.playAsync();
            });
          }, 3000)
        );
      }
    }
  }, [dataMagnometro.x, dataMagnometro.y, alarmaActivada]);
  const limparAlarmas = () => {
    console.log("alarmas desactivadas");
    clearInterval(timerHorizontal);
    clearInterval(timerVertical);
    clearInterval(timerDerecha);
    clearInterval(timerIzquierda);
    setDataPreviaMagnometro({ x: 0, y: 0, z: 0 });
    setDataMagnometro({
      x: 0,
      y: 0,
      z: 0,
    });
    setAlarmaActivada(false);
    console.log(alarmaActivada);
    setalarmaDerecha(false);
    setalarmaIzquierda(false);
    setAlarmaHorizontal(false);
    setAlarmaVertical(false);
    setArmado(false);
  };
  const ingresarPassword = () => {
    getUsuarioByEmail(
      auth.currentUser.email,
      (data) => {
        const respuesta = data.docs.map((doc) => doc.data());
        const { clave } = respuesta[0];
        if (password == clave) {
          limparAlarmas();
          props.onDesactivar();
        } else {
          showError(true);
          setTimeout(() => {
            showError(false);
          }, 3000);
        }
      },
      (error) => console.log(error)
    );
  };
  return (
    <View style={styles.container}>
      <StyledText aling="center" fontSize="heading">
        Alarma Activada
      </StyledText>
      {alarmaActivada && (
        <>
          <StyledTextInput
            value={password}
            style={{ fontSize: theme.fontSizes.title }}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            placeholder="Ingrese su contraseña para desactivar"
          ></StyledTextInput>
          {error && (
            <StyledText
              aling={"center"}
              fontSize="subHeading"
              color={"error"}
              error
            >
              La contraseña es inválida
            </StyledText>
          )}
          <StyledTouchableHighlight btnVotar onPress={() => ingresarPassword()}>
            <Text>Desactivar</Text>
          </StyledTouchableHighlight>
        </>
      )}

      <Text>
        x: {x} y: {y} z:
        {z}
      </Text>

      <>
        {showFlash && (
          <Camera
            style={{ width: 1, height: 1, position: "absolute" }}
            type={Camera.Constants.Type.back}
            ref={camaraRef}
            flashMode={"torch"}
            pictureSize=""
            ratio="1:1"
          />
        )}
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
  },
});
