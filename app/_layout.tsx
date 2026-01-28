import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="default" />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: "Home" }}
        />
        <Stack.Screen name="[id]" />
      </Stack>
    </>
  );
}