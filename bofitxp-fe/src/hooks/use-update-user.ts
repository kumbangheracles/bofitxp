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
  const { login, setAuthUser } = useAuth();
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

  const { mutateAsync: mutateUpdateUser, isPending: isPendingUpdateUser } =
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
      onSuccess: async (result) => {
        const responseData = result?.data?.data ?? result?.data ?? {};
        const updatedUser = responseData.updatedUser ?? responseData;
        const nextToken = responseData.token;

        if (nextToken) {
          await login(nextToken);
        }

        setAuthUser((prev) => {
          if (!prev) return { ...updatedUser } as any;

          return {
            ...prev,
            ...updatedUser,
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

  const handleUpdateUser = async (data: TUpdateUser) => mutateUpdateUser(data);

  return {
    handleSubmit,
    handleUpdateUser,
    isPendingUpdateUser,
    control,
    errors,
  };
};

export default useUpdateUser;
