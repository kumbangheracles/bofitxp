import { fontSize, fontWeight, spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePathname, useSegments } from "expo-router";
import { ReactNode } from "react";
import { Text, View } from "react-native";

interface PropTypes {
  children: ReactNode;
}

const AppPrivateLayout = ({ children }: PropTypes) => {
  const theme = useAppTheme();
  const segments = useSegments();

  console.log(segments);
  const listTabs = [
    {
      id: 1,
      key: "index",
      label: "Home",
      icon: (
        <MaterialCommunityIcons name="home" size={16} color={theme.textHint} />
      ),
    },
    {
      id: 2,
      key: "quests",
      label: "Quests",
      icon: (
        <MaterialCommunityIcons
          name="circle-off-outline"
          size={16}
          color={theme.textHint}
        />
      ),
    },
    {
      id: 3,
      key: "exercise",
      label: "Exercise",
      icon: (
        <MaterialCommunityIcons
          name="dumbbell"
          size={16}
          color={theme.textHint}
        />
      ),
    },
    {
      id: 4,
      key: "achievements",
      label: "Achievements",
      icon: (
        <MaterialCommunityIcons
          name="trophy-variant"
          size={16}
          color={theme.textHint}
        />
      ),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <View style={{ flex: 1 }}>{children}</View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center", // Agar icon dan teks rata tengah
          width: "100%",
          paddingHorizontal: 10,
          marginBottom: 44,
          paddingVertical: 12,
          backgroundColor: theme.background, // Berikan warna latar agar konten Stack tidak tembus
          borderTopWidth: 1,
          borderColor: theme.border, // Berikan garis batas jika ada
        }}
      >
        {listTabs?.map((item) => (
          // Tambahkan alignItems agar rata tengah vertikal
          <View
            key={item.id}
            style={{
              alignItems: "center",
              gap: 4,
              minWidth: 80,
              backgroundColor: theme.elevated,
              borderRadius: 12,
              paddingBlock: spacing.sm,
              paddingInline: spacing.md,
            }}
          >
            {item.icon}

            <Text
              style={{
                fontSize: 10,
                color: theme.textSecondary,
                fontWeight: fontWeight.bold,
              }}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AppPrivateLayout;
