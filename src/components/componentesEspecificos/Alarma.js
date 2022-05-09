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

export default function Alarma(props) {
  const [activado, setActivado] = useState(true);
  const camaraRef = useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [showFlash, setShowFlash] = useState(false);
  const [alarmaHorizontal, setAlarmaHorizontal] = useState(false); // x > 90 && y < 10 || x < -90 && y < 10
  const [alarmaVertical, setAlarmaVertical] = useState(false);
  const [alarmaDerecha, setalarmaDerecha] = useState(false);
  const [alarmaIzquierda, setalarmaIzquierda] = useState(false);
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
    Accelerometer.setUpdateInterval(500);
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
    if (!activado) return;

    const posicionX = Math.round(dataAcelerometro.x * 100);
    const posicionY = Math.round(dataAcelerometro.y * 100);
    if (
      (posicionX > 80 && posicionY < 20) ||
      (posicionX < -80 && posicionY < 20)
    ) {
      setAlarmaHorizontal(true);
      console.log("se activa horizontal");
    }

    if (
      (posicionX < 20 && posicionY > 80) ||
      (posicionX < 20 && posicionY < -80)
    ) {
      setAlarmaVertical(true);
      Sound.createAsync(require("../../../assets/audios/tortuga.wav")).then(
        ({ sound }) => {
          prenderFlashAsync();
          sound.playAsync();
        }
      );
      console.log("se activa vertical");
    }
  }, [dataAcelerometro.x, dataAcelerometro.y]);
  const prenderFlashAsync = () => {
    setShowFlash(true);
    setTimeout(() => {
      console.log("stop");
      setShowFlash(false);
    }, 5000);
  };
  //useEffect que controla los datos del magnometro

  useEffect(() => {
    if (alarmaVertical || alarmaHorizontal || alarmaDerecha || alarmaIzquierda)
      return;
    if (!activado) return;
    if (dataPreviaMagnometro.x == 0) {
      setDataPreviaMagnometro(dataMagnometro);
    }
    const posicionX = dataPreviaMagnometro.x - dataMagnometro.x;

    if (posicionX >= 3) {
      console.log("Se activa derecha");
      setalarmaDerecha(true);
    }

    if (posicionX <= -3) {
      console.log("Se activa izquierda");
      setalarmaIzquierda(true);
    }
  }, [dataMagnometro.x, dataMagnometro.y]);
  return (
    <View style={styles.container}>
      <StyledText aling="center" fontSize="heading">
        Alarma Activada
      </StyledText>
      <StyledTouchableHighlight
        btnVotar
        onPress={() => {
          setActivado(false);
          props.onDesactivar();
        }}
      >
        <Text>Desactivar</Text>
      </StyledTouchableHighlight>
      {/* <Text>
        x: {Math.round(x * 100)} y: {Math.round(y * 100)} z:
        {Math.round(z * 100)}
      </Text> */}
      <>
        {showFlash && (
          <Camera
            style={{ width: 1, height: 1 }}
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

const styles = StyleSheet.create({});
