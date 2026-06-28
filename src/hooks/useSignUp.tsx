import { useMutation } from "@tanstack/react-query";
import { signUpApi } from "../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useSignUp() {
  const navigate = useNavigate();

  const { data, mutate, error, isPending } = useMutation({
    mutationFn: signUpApi,

    onSuccess: () => {
      toast.success("Account created successfully");
      navigate("/login");
    },

    onError: () => {
      toast.error("Account already exists.");
    },
  });

  return { data, mutate, error, isPending };
}
