import * as Device from "expo-device";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimatedIcon } from "@/components/animated-icon";
import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import {
  BottomTabInset,
  MaxContentWidth,
  spacing,
  Spacing,
} from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/use-app-theme";

export default function index() {
  const theme = useAppTheme();
  return (
    <ThemedView
      style={{
        paddingInline: spacing.md,
        paddingTop: 50,
        paddingBottom: 30,
        backgroundColor: theme.elevated,
      }}
    >
      {/* <SafeAreaView style={styles.safeArea}>
        <> */}
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: theme.elevated,
        }}
      >
        <ThemedView style={{ backgroundColor: theme.elevated }}>
          <ThemedText>Welcome Back</ThemedText>
          <ThemedText style={{ fontWeight: 300, color: theme.textHint }}>
            Ready to level up?
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={{
            flexDirection: "row",
            gap: 10,
            backgroundColor: theme.elevated,
          }}
        >
          <ThemedView
            style={{
              padding: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              width: 37,
              height: 37,
              backgroundColor: theme.border,
            }}
          >
            <MaterialCommunityIcons
              style={{
                color: theme.text,
              }}
              name="bell"
              size={16}
            />
          </ThemedView>
          <ThemedView
            style={{
              padding: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              width: 37,
              height: 37,
              backgroundColor: theme.border,
            }}
          >
            <MaterialCommunityIcons
              style={{
                color: theme.text,
              }}
              name="cog"
              size={16}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 20,
          marginTop: 20,
        }}
      >
        <View
          style={{
            backgroundColor: theme.border,
            padding: 12,
            borderRadius: 16,
            maxWidth: 130,
          }}
        >
          <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
            <View>
              <MaterialCommunityIcons
                name="fire"
                size={13}
                color={theme.combo}
              />
            </View>
            <Text style={{ color: theme.text }}>Streak</Text>
          </View>
          <Text style={{ color: theme.text, fontWeight: 700, fontSize: 17 }}>
            7 Days
          </Text>
        </View>
        <View
          style={{
            backgroundColor: theme.border,
            padding: 12,
            borderRadius: 16,
            maxWidth: 130,
          }}
        >
          <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
            <View>
              <MaterialCommunityIcons
                name="fire"
                size={13}
                color={theme.combo}
              />
            </View>
            <Text style={{ color: theme.text }}>Streak</Text>
          </View>
          <Text style={{ color: theme.text, fontWeight: 700, fontSize: 17 }}>
            7 Days
          </Text>
        </View>
        <View
          style={{
            backgroundColor: theme.border,
            padding: 12,
            borderRadius: 16,
            maxWidth: 130,
          }}
        >
          <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
            <View>
              <MaterialCommunityIcons
                name="fire"
                size={13}
                color={theme.combo}
              />
            </View>
            <Text style={{ color: theme.text }}>Streak</Text>
          </View>
          <Text style={{ color: theme.text, fontWeight: 700, fontSize: 17 }}>
            7 Days
          </Text>
        </View>
      </View>
      {/* </> */}

      {/* {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    // flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
