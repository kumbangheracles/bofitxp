import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { fontSize, fontWeight, radius, spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import AppModal from "@/components/app-modal";
import AppInput from "@/components/app-input";
import useUpdateUser from "@/hooks/use-update-user";

interface InformationItem {
  id:
    | "fullName"
    | "username"
    | "email"
    | "password"
    | "gender"
    | "age"
    | "target_final";
  label: string;
  value: string;
  icon: string;
  type: "text" | "password" | "number" | "select";
  options?: Array<{ label: string; value: string }>;
}

const EditInformationIndex = () => {
  const theme = useAppTheme();
  const { authUser } = useAuth();
  const { handleUpdateUser, isPendingUpdateUser } = useUpdateUser();
  const [selectedField, setSelectedField] = useState<InformationItem | null>(
    null,
  );
  const [draftValue, setDraftValue] = useState<string>("");

  const getDisplayValue = (field: InformationItem["id"]) => {
    const value = authUser?.[field as keyof typeof authUser];

    if (field === "password") return "••••••••";
    if (field === "gender") {
      return value
        ? String(value).charAt(0).toUpperCase() + String(value).slice(1)
        : "Not set";
    }
    if (field === "age") {
      return value ? `${value} years` : "Not set";
    }
    if (field === "target_final") {
      const targetValue =
        (authUser as any)?.target_final ?? (authUser as any)?.targetFinal;
      if (!targetValue) return "Not set";
      return String(targetValue)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    if (!value || String(value).trim() === "") return "Not set";
    return String(value);
  };

  const informationList: InformationItem[] = [
    {
      id: "fullName",
      label: "Full Name",
      value: getDisplayValue("fullName"),
      icon: "account-outline",
      type: "text",
    },
    {
      id: "username",
      label: "Username",
      value: getDisplayValue("username"),
      icon: "account-circle-outline",
      type: "text",
    },
    {
      id: "email",
      label: "Email",
      value: getDisplayValue("email"),
      icon: "email-outline",
      type: "text",
    },
    {
      id: "password",
      label: "Password",
      value: getDisplayValue("password"),
      icon: "lock-outline",
      type: "password",
    },
    {
      id: "gender",
      label: "Gender",
      value: getDisplayValue("gender"),
      icon: "gender-male-female",
      type: "select",
      options: [
        { label: "Pria", value: "pria" },
        { label: "Wanita", value: "wanita" },
      ],
    },
    {
      id: "age",
      label: "Age",
      value: getDisplayValue("age"),
      icon: "calendar-month-outline",
      type: "number",
    },
    {
      id: "target_final",
      label: "Target Final",
      value: getDisplayValue("target_final"),
      icon: "target",
      type: "select",
      options: [
        { label: "Weight Loss", value: "weight_loss" },
        { label: "Muscle Gain", value: "muscle_gain" },
        { label: "Maintain Fitness", value: "maintain_fitness" },
        { label: "Endurance", value: "endurance" },
      ],
    },
  ];

  const openEditModal = (item: InformationItem) => {
    const currentValue =
      item.id === "password"
        ? ""
        : item.id === "age"
          ? String((authUser as any)?.age ?? "")
          : item.id === "target_final"
            ? String(
                (authUser as any)?.target_final ??
                  (authUser as any)?.targetFinal ??
                  "",
              )
            : item.id === "gender"
              ? String((authUser as any)?.gender ?? "")
              : String((authUser as any)?.[item.id] ?? "");

    setSelectedField(item);
    setDraftValue(currentValue);
  };

  const handleSaveField = () => {
    if (!selectedField) return;

    const payload: Record<string, string | number> = {};

    if (selectedField.id === "password") {
      if (!draftValue.trim()) return;
      payload.password = draftValue.trim();
    } else if (selectedField.id === "age") {
      if (draftValue.trim() === "") return;
      payload.age = Number(draftValue);
    } else if (selectedField.id === "gender") {
      if (!draftValue.trim()) return;
      payload.gender = draftValue;
    } else if (selectedField.id === "target_final") {
      if (!draftValue.trim()) return;
      payload.target_final = draftValue;
    } else {
      if (!draftValue.trim()) return;
      payload[selectedField.id] = draftValue.trim();
    }

    handleUpdateUser(payload as any);
    setSelectedField(null);
    setDraftValue("");
  };

  const renderFieldInput = () => {
    if (!selectedField) return null;

    if (selectedField.type === "select") {
      return (
        <View style={styles.optionGroup}>
          {selectedField.options?.map((option) => {
            const isActive = draftValue === option.value;

            return (
              <Pressable
                key={option.value}
                onPress={() => setDraftValue(option.value)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isActive
                      ? `${theme.primary}1A`
                      : theme.elevated,
                    borderColor: isActive ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isActive ? theme.primary : theme.text },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      );
    }

    return (
      <AppInput
        label={selectedField.label}
        value={draftValue}
        onChangeText={setDraftValue}
        keyboardType={selectedField.type === "number" ? "numeric" : "default"}
        secureTextEntry={selectedField.type === "password"}
        isPassword={selectedField.type === "password"}
        placeholder={`Input ${selectedField.label.toLowerCase()}`}
        autoCapitalize={selectedField.id === "email" ? "none" : "sentences"}
      />
    );
  };

  return (
    <>
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          paddingTop: 50,
          paddingBottom: spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <ThemedText style={styles.title}>Edit Information</ThemedText>
          <Text style={[styles.subtitle, { color: theme.textHint }]}>
            Personal details
          </Text>
        </View>

        <ThemedView
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          {informationList.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => openEditModal(item)}
              style={({ pressed }) => [
                styles.menuRow,
                {
                  borderBottomWidth:
                    index === informationList.length - 1 ? 0 : 1,
                  borderBottomColor: theme.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.menuIconWrap,
                  { backgroundColor: `${theme.primary}1A` },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={20}
                  color={theme.primary}
                />
              </View>

              <View style={styles.textWrap}>
                <Text style={[styles.labelText, { color: theme.textHint }]}>
                  {item.label}
                </Text>
                <Text style={[styles.valueText, { color: theme.text }]}>
                  {item.value}
                </Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={theme.textHint}
              />
            </Pressable>
          ))}
        </ThemedView>
      </ScrollView>

      <AppModal
        visible={!!selectedField}
        title={selectedField?.label ?? "Edit Information"}
        onClose={() => {
          setSelectedField(null);
          setDraftValue("");
        }}
        onConfirm={handleSaveField}
        confirmText="Save"
        isConfirmLoading={isPendingUpdateUser}
      >
        {renderFieldInput()}
      </AppModal>
    </>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
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
  textWrap: {
    flex: 1,
  },
  labelText: {
    fontSize: fontSize.xs,
    marginBottom: 2,
  },
  valueText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  optionGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  optionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});

export default EditInformationIndex;
