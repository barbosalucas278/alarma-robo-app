import * as Font from "expo-font";
import { LilitaOne_400Regular } from "@expo-google-fonts/lilita-one";

export default useFonts = async () => {
  await Font.loadAsync({
    LilitaOne_400Regular: LilitaOne_400Regular,
  });
};
