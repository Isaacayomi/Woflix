import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { googleLoginApi } from "../services/apiAuth";
import { trackUserCountry } from "../services/apiGeolocation";

function getGoogleAuthErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;

  switch (code) {
    case "auth/popup-closed-by-user":
      return "Sign-in cancelled. Please try again.";
    case "auth/popup-blocked":
      return "Popup was blocked. Please allow popups for this site.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using a different sign-in method. Please use your original sign-in method.";
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled. Please contact support.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized. Please contact support.";
    default:
      return "Google sign-in failed. Please try again.";
  }
}

export function useGoogleLogin() {
  const navigate = useNavigate();

  const { mutate: googleLogin, isPending } = useMutation({
    mutationFn: googleLoginApi,
    onSuccess: () => {
      trackUserCountry();
      navigate("/", { replace: true });
      toast.success("Logged in successfully");
    },
    onError: (error: unknown) => {
      toast.error(getGoogleAuthErrorMessage(error));
    },
  });

  return { googleLogin, isPending };
}
