import React from "react";
import { View } from "react-native";
import { Slot } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCustomToast } from "@/context/CostumToastProvider";
import { AnimatedToast } from "./custom-animated-toast";

// Komponen perantara khusus untuk merender Toast global berdasarkan Context
const GlobalToastManager = () => {
  const { visible, message, subtitle, type } = useCustomToast();

  // Menentukan warna & ikon dinamis berdasarkan tipe toast
  const isError = type === "error";
  const colors = isError ? ["#FF416C", "#FF4B2B"] : ["#FF7A00", "#FF3D00"];

  const icons = [
    <MaterialCommunityIcons name="fire" size={32} color="#FF5722" key="1" />,
    <MaterialCommunityIcons name="flash" size={36} color="#FFEB3B" key="2" />,
  ];

  return (
    <AnimatedToast
      visible={visible}
      title={message}
      subtitle={subtitle}
      colors={colors}
      icons={icons}
    />
  );
};

export default GlobalToastManager;
