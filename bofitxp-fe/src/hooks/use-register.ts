import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  registerValidateSchema,
  TRegister,
} from "@/utils/validation/user.validation";
import { AuthService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
const useRegister = () => {
  const authServices = new AuthService();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<TRegister>({
    resolver: yupResolver(registerValidateSchema),
  });

  const { mutate: mutateRegister, isPending: isPendingRegister } = useMutation({
    mutationFn: authServices.register,
    onError(error) {
      setError("root", {
        message: error.message,
      });
      //   setToaster({ type: "error", message: error.message });
      alert(error.message);
    },
    onSuccess: (_, variables) => {
      const registeredEmail = variables.email;

      alert("Register berhasil");

      if (registeredEmail) {
        SecureStore.setItemAsync("email_activation", registeredEmail);
      }

      reset();

      router.push("/public/activation");
    },
  });

  const handleRegister = (data: TRegister) => mutateRegister(data);

  return { handleRegister, handleSubmit, control, isPendingRegister, errors };
};

export default useRegister;
