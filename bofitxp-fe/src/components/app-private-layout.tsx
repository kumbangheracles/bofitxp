import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Text, View } from "react-native";

interface PropTypes {
  children: ReactNode;
}

const AppPrivateLayout = ({ children }: PropTypes) => {
  const theme = useAppTheme();
  const listTabs = [
    {
      id: 1,
      label: "Home",
      icon: (
        <MaterialCommunityIcons name="home" size={16} color={theme.elevated} />
      ),
    },
    {
      id: 2,
      label: "Quests",
      icon: (
        <MaterialCommunityIcons
          name="circle-off-outline"
          size={16}
          color={theme.elevated}
        />
      ),
    },
    {
      id: 3,
      label: "Exercise",
      icon: (
        <MaterialCommunityIcons
          name="dumbbell"
          size={16}
          color={theme.elevated}
        />
      ),
    },
    {
      id: 4,
      label: "Achievements", // Typo diperbaiki
      icon: (
        <MaterialCommunityIcons
          name="trophy-variant"
          size={16}
          color={theme.elevated}
        />
      ),
    },
  ];

  return (
    // 1. Berikan flex: 1 agar memenuhi seluruh layar
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      {/* 2. Berikan flex: 1 pada kontainer children (Stack) agar ia mendorong footer ke bawah */}
      <View style={{ flex: 1 }}>{children}</View>

      {/* 3. Perbaikan styling Footer (tanpa position: fixed) */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center", // Agar icon dan teks rata tengah
          width: "100%",
          paddingHorizontal: 24,
          paddingVertical: 12,
          backgroundColor: theme.background, // Berikan warna latar agar konten Stack tidak tembus
          borderTopWidth: 1,
          borderColor: theme.border, // Berikan garis batas jika ada
        }}
      >
        {listTabs?.map((item) => (
          // Tambahkan alignItems agar rata tengah vertikal
          <View key={item.id} style={{ alignItems: "center", gap: 4 }}>
            {/* 4. Render elemen ReactNode icon yang sudah kamu buat di array */}
            {item.icon}

            {/* 5. Gunakan label dinamis */}
            <Text style={{ fontSize: 12, color: theme.textSecondary }}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AppPrivateLayout;
