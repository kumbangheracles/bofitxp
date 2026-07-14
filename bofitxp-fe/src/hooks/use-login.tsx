import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  loginValidateSchema,
  TLogin,
} from "@/utils/validation/user.validation";
import { AuthService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@/context/AuthContext";
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
      alert(error.message);
    },
    onSuccess: async (data) => {
      await loginSaveToken(data.data.toString() as string);
      console.log("Data: ", data);

      alert("Login success.");
      reset();
      router.push("/private/(tabs)");
    },
  });

  const handleLogin = (data: TLogin) => mutateLogin(data);

  return { handleLogin, handleSubmit, control, isPendingLogin, errors };
};

export default useLogin;
