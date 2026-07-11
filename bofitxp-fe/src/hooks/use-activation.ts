import { useForm } from "react-hook-form";
import { AuthService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { UserProps } from "@/types/user.type";
const useActivation = () => {
  const authServices = new AuthService();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const { mutate: mutateActivation, isPending: isPendingActivation } =
    useMutation({
      mutationFn: authServices.activationCode,
      onError(error) {
        setError("root", {
          message: error.message,
        });
        //   setToaster({ type: "error", message: error.message });
        alert(error.message);
      },
      onSuccess: () => {
        reset();
        alert("Account Activation Success.");
        //   setToaster({ type: "success", message: "Register success" });
        router.push("/public/login");
      },
    });

  const handleActivation = (data: UserProps["activationCode"]) =>
    mutateActivation(data);

  return {
    handleActivation,
    handleSubmit,
    control,
    isPendingActivation,
    errors,
  };
};

export default useActivation;
