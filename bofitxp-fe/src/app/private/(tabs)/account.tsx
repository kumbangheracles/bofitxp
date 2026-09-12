import { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuth } from "@/context/AuthContext";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { spacing, radius, fontSize, fontWeight } from "@/constants/theme";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  onPress?: () => void;
  danger?: boolean;
  badge?: string;
}

const AccountScreen = () => {
  const theme = useAppTheme();
  const router = useRouter();
  const { authUser, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      //   router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const accountMenu: MenuItem[] = [
    {
      id: "edit-info",
      label: "Edit Information",
      icon: "account-edit-outline",
      //   onPress: () => router.push("/account/edit-information"),
    },
    {
      id: "edit-bmi",
      label: "Edit BMI",
      icon: "scale-bathroom",
      //   onPress: () => router.push("/account/edit-bmi"),
      badge: authUser?.body_mass_index
        ? `${authUser.body_mass_index} BMI`
        : undefined,
    },
  ];

  const supportMenu: MenuItem[] = [
    {
      id: "settings",
      label: "Settings",
      icon: "cog-outline",
      //   onPress: () => router.push("/account/settings"),
    },
    {
      id: "faq",
      label: "FAQ",
      icon: "help-circle-outline",
      //   onPress: () => router.push("/account/faq"),
    },
  ];

  const renderMenuItem = (item: MenuItem, isLast: boolean) => (
    <Pressable
      key={item.id}
      onPress={item.onPress}
      style={({ pressed }) => [
        styles.menuRow,
        {
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: theme.border,
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.menuIconWrap,
          {
            backgroundColor: item.danger
              ? `${theme.danger}1A`
              : `${theme.primary}1A`,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={20}
          color={item.danger ? theme.danger : theme.primary}
        />
      </View>

      <Text
        style={[
          styles.menuLabel,
          { color: item.danger ? theme.danger : theme.text },
        ]}
      >
        {item.label}
      </Text>

      {item.badge && (
        <View
          style={[
            styles.badge,
            { backgroundColor: theme.elevated, borderColor: theme.border },
          ]}
        >
          <Text style={{ fontSize: fontSize.xs, color: theme.textSecondary }}>
            {item.badge}
          </Text>
        </View>
      )}

      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={theme.textHint}
      />
    </Pressable>
  );

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header / Hero */}
      <View
        style={{
          paddingTop: 60,
          paddingBottom: spacing.xl,
          paddingHorizontal: spacing.md,
          backgroundColor: theme.elevated,
          borderBottomLeftRadius: radius.xl,
          borderBottomRightRadius: radius.xl,
        }}
      >
        <ThemedText
          style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold }}
        >
          Account
        </ThemedText>

        <View style={{ alignItems: "center", marginTop: spacing.lg }}>
          <View style={styles.avatarWrap}>
            <View
              style={[styles.avatarRing, { borderColor: theme.xpProgress }]}
            >
              {authUser?.avatarUrl ? (
                <Image
                  source={{ uri: authUser.avatarUrl }}
                  style={styles.avatar}
                />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: theme.primary,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: fontSize.xxl,
                      fontWeight: fontWeight.bold,
                      color: "#FFFFFF",
                    }}
                  >
                    {(authUser?.fullName ?? authUser?.username ?? "U")
                      .charAt(0)
                      .toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            <Pressable
              style={[
                styles.editAvatarBtn,
                { backgroundColor: theme.primary, borderColor: theme.elevated },
              ]}
              //   onPress={() => router.push("/account/edit-information")}
            >
              <MaterialCommunityIcons name="camera" size={14} color="#FFFFFF" />
            </Pressable>
          </View>

          <Text
            style={{
              marginTop: spacing.sm,
              fontSize: fontSize.lg,
              fontWeight: fontWeight.semibold,
              color: theme.text,
            }}
          >
            {authUser?.fullName ?? authUser?.username ?? "Fitness Warrior"}
          </Text>
          <Text style={{ fontSize: fontSize.sm, color: theme.textHint }}>
            {authUser?.email ?? "—"}
          </Text>

          {/* Level / XP strip */}
          <View
            style={[
              styles.statsRow,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={16}
                color={theme.xpProgress}
              />
              <Text style={[styles.statValue, { color: theme.text }]}>
                {authUser?.xp ?? 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textHint }]}>
                XP
              </Text>
            </View>

            <View
              style={[styles.statDivider, { backgroundColor: theme.border }]}
            />

            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="trophy"
                size={16}
                color={theme.achievement}
              />
              <Text style={[styles.statValue, { color: theme.text }]}>
                {authUser?.level ?? 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textHint }]}>
                Level
              </Text>
            </View>

            <View
              style={[styles.statDivider, { backgroundColor: theme.border }]}
            />

            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="scale-bathroom"
                size={16}
                color={theme.combo}
              />
              <Text style={[styles.statValue, { color: theme.text }]}>
                {authUser?.body_mass_index ?? "—"}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textHint }]}>
                BMI
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Account section */}
      <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
        <Text
          style={{
            fontSize: fontSize.sm,
            fontWeight: fontWeight.semibold,
            color: theme.textHint,
            marginBottom: spacing.xs,
            marginLeft: spacing.xs,
          }}
        >
          ACCOUNT
        </Text>
        <ThemedView
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          {accountMenu.map((item, i) =>
            renderMenuItem(item, i === accountMenu.length - 1),
          )}
        </ThemedView>
      </View>

      {/* Support section */}
      <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
        <Text
          style={{
            fontSize: fontSize.sm,
            fontWeight: fontWeight.semibold,
            color: theme.textHint,
            marginBottom: spacing.xs,
            marginLeft: spacing.xs,
          }}
        >
          SUPPORT
        </Text>
        <ThemedView
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          {supportMenu.map((item, i) =>
            renderMenuItem(item, i === supportMenu.length - 1),
          )}
        </ThemedView>
      </View>

      {/* Logout */}
      <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
        <ThemedView
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Pressable
            onPress={handleLogout}
            disabled={loggingOut}
            style={({ pressed }) => [
              styles.menuRow,
              {
                borderBottomWidth: 0,
                opacity: pressed || loggingOut ? 0.6 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.menuIconWrap,
                { backgroundColor: `${theme.danger}1A` },
              ]}
            >
              <MaterialCommunityIcons
                name="logout"
                size={20}
                color={theme.danger}
              />
            </View>
            <Text style={[styles.menuLabel, { color: theme.danger }]}>
              {loggingOut ? "Logging out..." : "Logout"}
            </Text>
          </Pressable>
        </ThemedView>
      </View>

      <Text
        style={{
          textAlign: "center",
          marginTop: spacing.xl,
          fontSize: fontSize.xs,
          color: theme.textHint,
        }}
      >
        BofitXP v1.0.0
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  avatarWrap: {
    position: "relative",
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
  },
  statItem: {
    alignItems: "center",
    gap: 2,
    minWidth: 56,
  },
  statValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    fontSize: 10,
  },
  statDivider: {
    width: 1,
    height: 28,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.xs,
  },
});

export default AccountScreen;
