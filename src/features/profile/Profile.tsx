import { useState } from "react";
import { auth } from "../../lib/firebase";
import { useDarkMode } from "../../hooks/useDarkMode";
import Heading from "../../ui/Heading";

function Profile() {
  const user = auth.currentUser;
  const [, toggleDark] = useDarkMode();
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return true;
  });

  const handleToggle = () => {
    toggleDark();
    setDark((prev) => !prev);
  };

  return (
    <div className="h-screen">
      <Heading>Profile</Heading>

      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-white">
          <img
            src="./assets/image-avatar.png"
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="text-center">
          <p className="text-xl font-semibold">
            {user?.displayName || "User"}
          </p>
          <p className="text-sm text-grayishBlue">{user?.email}</p>
        </div>

        <div className="mt-4 flex w-full max-w-md flex-col gap-4 rounded-xl bg-semiDarkBlue p-6">
          <h3 className="text-lg font-semibold">Preferences</h3>

          <div className="flex items-center justify-between">
            <span className="text-sm">Dark Mode</span>
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
        </div>
      </div>
    </div>
  );
}

export default Profile;
