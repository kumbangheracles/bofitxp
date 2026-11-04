import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  loginValidateSchema,
  TLogin,
} from "@/utils/validation/user.validation";
import { AuthService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Toast from "react-native-toast-message";
const useLogin = () => {
  const authServices = new AuthService();
  const { login: loginSaveToken } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<TLogin>({
    resolver: yupResolver(loginValidateSchema),
  });

  const { mutate: mutateLogin, isPending: isPendingLogin } = useMutation({
    mutationFn: authServices.login,
    onError(error) {
      setError("root", {
        message: error.message,
      });
      Toast.show({
        type: "error",
        text1: error.message,
        text2: "Password or email is incorrect.",
      });
    },
    onSuccess: async (data) => {
      await loginSaveToken(data.data); // data.data = token string
      console.log("Data: ", data.data);
      Toast.show({
        type: "success",
        text1: "Login Success",
        text2: `Welcome back`,
      });

      reset();

      router.push("/private/(tabs)/home");
    },
  });

  const handleLogin = (data: TLogin) => mutateLogin(data);

  return { handleLogin, handleSubmit, control, isPendingLogin, errors };
};

export default useLogin;
