import React from "react";
import { View } from "react-native";
import { Slot } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCustomToast } from "@/context/CostumToastProvider";
import { AnimatedToast } from "./custom-animated-toast";

// Komponen perantara khusus untuk merender Toast global berdasarkan Context
const GlobalToastManager = () => {
  const { visible, message, subtitle, type } = useCustomToast();

  const isError = type === "error";
  const isInfo = type === "info";
  const colors = isError
    ? ["#FF416C", "#FF4B2B"]
    : isInfo
      ? ["#F59E0B", "#F97316"]
      : ["#FF7A00", "#FF3D00"];

  const icons = [
    <MaterialCommunityIcons
      name={isInfo ? "lightning-bolt" : "fire"}
      size={32}
      color={isInfo ? "#FDE68A" : "#FF5722"}
      key="1"
    />,
    <MaterialCommunityIcons
      name={isInfo ? "star" : "flash"}
      size={36}
      color={isInfo ? "#FFF7CC" : "#FFEB3B"}
      key="2"
    />,
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
