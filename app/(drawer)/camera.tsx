import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

interface ColoredButtonProps {
  title: string;
  onPress: () => void;
  color: string;
  icon?: string;
}

const BButton: React.FC<ColoredButtonProps> = ({
  title,
  onPress,
  color,
  icon,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, { backgroundColor: color }]}>
    {icon && (
      <MaterialIcons
        name={icon as "share" | "save" | "cancel"}
        size={24}
        color="white"
      />
    )}
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default function App() {
  let cameraRef = useRef<Camera | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | undefined
  >();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<
    boolean | undefined
  >();
  const [photo, setPhoto] = useState<
    { uri: string; base64: string } | undefined
  >();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef?.current?.takePictureAsync(options);
    if (newPhoto && newPhoto.base64) {
      setPhoto({
        uri: newPhoto.uri,
        base64: newPhoto.base64,
      });
    }
  };

  if (photo) {
    let sharePic = () => {
      shareAsync(photo?.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo?.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
          }}>
          <BButton
            title="Share"
            onPress={sharePic}
            color="#3498db"
            icon="share"
          />

          {hasMediaLibraryPermission && (
            <BButton
              title="Save"
              onPress={savePhoto}
              color="#2ecc71"
              icon="save"
            />
          )}
          <BButton
            title="Discard"
            onPress={() => setPhoto(undefined)}
            color="#e74c3c"
            icon="cancel"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity activeOpacity={0.7} onPress={takePic}>
          <View style={styles.shutterButton}>
            <MaterialCommunityIcons name="camera" size={30} color={"#000"} />
          </View>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
  shutterButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
