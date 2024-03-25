import React, { useEffect, useRef } from "react";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "expo-router";
import { HomeMarkerLocation } from "@/components/location";

const INITIAL_REGION = {
  latitude: -1.9374919029084798,
  longitude: 30.06584107875824,
  latitudeDelta: 0.2910178521067386,
  longitudeDelta: 0.16485057771205547,
};

export default function Location() {
  const navigation = useNavigation();
  const mapRef = useRef<any>(null);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={focusMap}>
          <View style={{ padding: 10 }}>
            <Text>Focus</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, []);

  const focusMap = () => {
    const HomeLocation = {
      latitude: -1.9369985051019172,
      longitude: 30.074106641113758,
      latitudeDelta: 0.022471439902681745,
      longitudeDelta: 0.012729093432430005,
    };

    mapRef.current?.animateToRegion(HomeLocation);
  };

  const onMarkerSelected = (marker: any) => {
    Alert.alert(marker.name);
  };

  const calloutPressed = (ev: any) => {
    console.log(ev);
  };

  const onRegionChange = (region: Region) => {
    console.log(region);
  };
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        onRegionChangeComplete={onRegionChange}
      >
        {HomeMarkerLocation.map((marker, index) => (
          <Marker
            key={index}
            title={marker.name}
            coordinate={marker}
            onPress={() => onMarkerSelected(marker)}
          >
            <Callout onPress={calloutPressed}>
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 24 }}>My Location</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}
