import { useState, useEffect } from "react";
import {
  auth,
} from "../../lib/firebase";
import {
  updateProfile,
  updatePassword,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useLogout } from "../../hooks/useLogout";
import Heading from "../../ui/Heading";
import SpinnerMini from "../../ui/SpinnerMini";
import toast from "react-hot-toast";

function Profile() {
  const user = auth.currentUser;
  const { logout, isPending: logoutPending } = useLogout();
  const [, toggleDark] = useDarkMode();
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return true;
  });

  // Display name
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [savingName, setSavingName] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Email verification
  const [sendingVerification, setSendingVerification] = useState(false);
  const [refreshingVerification, setRefreshingVerification] = useState(false);
  const [verified, setVerified] = useState(user?.emailVerified ?? false);

  useEffect(() => {
    if (!user) return;
    const unsub = user.getIdTokenResult(true).then(() => {
      setVerified(user.emailVerified);
    });
    return () => { void unsub; };
  }, [user]);

  const handleRefreshVerification = async () => {
    if (!user) return;
    setRefreshingVerification(true);
    try {
      await user.reload();
      setVerified(user.emailVerified);
      toast.success(
        user.emailVerified
          ? "Email verified — thank you!"
          : "Still not verified. Check your inbox.",
      );
    } catch {
      toast.error("Failed to refresh status");
    } finally {
      setRefreshingVerification(false);
    }
  };

  const handleToggle = () => {
    toggleDark();
    setDark((prev) => !prev);
  };

  const handleSaveName = async () => {
    if (!user || !displayName.trim()) return;
    setSavingName(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      toast.success("Display name updated");
    } catch {
      toast.error("Failed to update display name");
    } finally {
      setSavingName(false);
    }
  };

  const handleSendVerification = async () => {
    if (!user) return;
    setSendingVerification(true);
    try {
      await sendEmailVerification(user);
      toast.success("Verification email sent");
    } catch {
      toast.error("Failed to send verification email");
    } finally {
      setSendingVerification(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user || !user.email || !currentPassword || !newPassword) return;
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setSavingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="px-6 pb-12 pt-6 md:px-12">
      <Heading>Settings</Heading>

      <div className="mx-auto mt-8 max-w-2xl space-y-8">
        {/* Profile section */}
        <section className="rounded-xl bg-semiDarkBlue p-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-white">
              <img
                src="/assets/image-avatar.png"
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              {/* Display name */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-lg font-semibold text-white outline-none focus:ring-2 focus:ring-red"
                  placeholder="Your name"
                />
                <button
                  onClick={handleSaveName}
                  disabled={savingName}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-red text-white hover:bg-red/80 disabled:opacity-50"
                >
                  {savingName ? (
                    <SpinnerMini />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Email */}
              <div className="mt-2 flex items-center gap-2 text-sm text-grayishBlue">
                <span>{user?.email}</span>
                {user?.emailVerified || verified ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    Verified
                  </span>
                ) : (
                  <>
                    <span className="text-yellow-400">Not verified</span>
                    <button
                      onClick={handleSendVerification}
                      disabled={sendingVerification}
                      className="text-xs text-red underline hover:text-red/80 disabled:opacity-50"
                    >
                      {sendingVerification ? "Sending..." : "Resend verification"}
                    </button>
                    <button
                      onClick={handleRefreshVerification}
                      disabled={refreshingVerification}
                      className="text-xs text-grayishBlue underline hover:text-white disabled:opacity-50"
                    >
                      {refreshingVerification ? "Refreshing..." : "Refresh status"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Security section */}
        <section className="rounded-xl bg-semiDarkBlue p-6">
          <h3 className="mb-4 text-lg font-semibold">Security</h3>

          {showPasswordForm ? (
            <div className="space-y-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-red"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 6 characters)"
                className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-red"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleChangePassword}
                  disabled={savingPassword}
                  className="rounded-lg bg-red px-4 py-2 text-sm font-medium hover:bg-red/80 disabled:opacity-50"
                >
                  {savingPassword ? <SpinnerMini /> : "Save Password"}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword("");
                    setNewPassword("");
                  }}
                  className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
            >
              Change Password
            </button>
          )}
        </section>

        {/* Preferences section */}
        <section className="rounded-xl bg-semiDarkBlue p-6">
          <h3 className="mb-4 text-lg font-semibold">Preferences</h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-grayishBlue">
                Toggle dark / light theme
              </p>
            </div>
            <button
              onClick={handleToggle}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                dark ? "bg-red" : "bg-grayishBlue"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  dark ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </section>

        {/* Sign out */}
        <section className="rounded-xl bg-semiDarkBlue p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sign Out</p>
              <p className="text-xs text-grayishBlue">
                Sign out of your account
              </p>
            </div>
            <button
              onClick={() => logout()}
              disabled={logoutPending}
              className="rounded-lg bg-red px-4 py-2 text-sm font-medium hover:bg-red/80 disabled:opacity-50"
            >
              {logoutPending ? <SpinnerMini /> : "Sign Out"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
