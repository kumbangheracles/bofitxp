import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserService } from "@/services/user.service";
import {
  TUpdateUser,
  updateUserSchema,
} from "@/utils/validation/user.validation";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";
import { useGlobalState } from "@/context/GlobalStateContext";

const useUpdateUser = () => {
  const userService = new UserService();
  const { setAuthUser } = useAuth();
  const { setIsOpenModalBmi } = useGlobalState();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(updateUserSchema),
  });

  const { mutate: mutateUpdateUser, isPending: isPendingUpdateUser } =
    useMutation({
      mutationFn: userService.updateUser,
      onError(error) {
        setError("root", {
          message: error.message,
        });
        Toast.show({
          type: "error",
          text1: "Failed update user",
          text2: "Please try again.",
        });
      },
      onSuccess: (result) => {
        const updatedUser = result.data.data;

        setAuthUser((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            body_mass_index: updatedUser.body_mass_index,
            body_weight: updatedUser.body_weight,
            body_height: updatedUser.body_height,
          };
        });

        reset();

        setIsOpenModalBmi(false);
        Toast.show({
          type: "success",
          text1: "Success update user",
        });
      },
    });

  const handleUpdateUser = (data: TUpdateUser) => mutateUpdateUser(data);

  return {
    handleSubmit,
    handleUpdateUser,
    isPendingUpdateUser,
    control,
    errors,
  };
};

export default useUpdateUser;
