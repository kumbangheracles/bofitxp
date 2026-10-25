import { Controller } from "react-hook-form";
import { View, Text } from "react-native";
import AppInput from "./app-input";
import AppModal from "./app-modal";
import useUpdateUser from "@/hooks/use-update-user";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuth } from "@/context/AuthContext";
import { useGlobalState } from "@/context/GlobalStateContext";

const BmiModal = () => {
  const { isOpenModalBmi, setIsOpenModalBmi } = useGlobalState();
  const { authUser } = useAuth();
  const theme = useAppTheme();
  const {
    control: controlUpdateUser,
    errors: errorsUpdateUser,
    handleSubmit: handleSubmitUpdateUser,
    handleUpdateUser: handleMutateUpdateUser,
    isPendingUpdateUser,
  } = useUpdateUser();
  return (
    <AppModal
      visible={isOpenModalBmi}
      onConfirm={handleSubmitUpdateUser((data) => {
        handleMutateUpdateUser(data);
      })}
      confirmText="Save"
      isConfirmLoading={isPendingUpdateUser}
      title={
        authUser?.body_mass_index === null
          ? "Input your BMI"
          : "Calculate your BMI"
      }
      onClose={() => setIsOpenModalBmi(false)}
    >
      <View>
        <Controller
          control={controlUpdateUser}
          name="body_weight"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label="Body Weight"
              disableFullscreenUI={isPendingUpdateUser}
              keyboardType="numeric"
              onChangeText={(text) => {
                onChange(text === "" ? undefined : Number(text));
              }}
              value={value?.toString() ?? ""}
              autoCapitalize="none"
            />
          )}
        />

        {errorsUpdateUser.body_weight && (
          <Text style={{ color: theme.danger, marginBottom: 10 }}>
            {errorsUpdateUser.body_weight.message}
          </Text>
        )}

        <Controller
          control={controlUpdateUser}
          name="body_height"
          render={({ field: { onChange, value } }) => (
            <AppInput
              label="Body Height"
              disableFullscreenUI={isPendingUpdateUser}
              keyboardType="numeric"
              onChangeText={(text) => {
                onChange(text === "" ? undefined : Number(text));
              }}
              value={value?.toString() ?? ""}
              autoCapitalize="none"
            />
          )}
        />

        {errorsUpdateUser.body_height && (
          <Text style={{ color: theme.danger, marginBottom: 10 }}>
            {errorsUpdateUser.body_height.message}
          </Text>
        )}
      </View>
    </AppModal>
  );
};

export default BmiModal;
