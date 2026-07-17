import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import type { AuthProps } from "types";

export async function loginApi({ email, password }: AuthProps) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signUpApi({ email, password }: AuthProps) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return credential.user;
}

export async function getCurrentUser() {
  return auth.currentUser;
}

export async function logoutApi() {
  await signOut(auth);
}

export function isMobileOrStandalone(): boolean {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone ===
      true;
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  return isStandalone || isMobile;
}

export function googleLoginApi() {
  const provider = new GoogleAuthProvider();

  if (isMobileOrStandalone()) {
    return signInWithRedirect(auth, provider);
  }

  return signInWithPopup(auth, provider);
}

export async function handleRedirectResult() {
  const result = await getRedirectResult(auth);
  return result;
}
