import { Outlet, Link } from "react-router-dom";
import Search from "../features/search/Search";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";

function AppLayout() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-darkBlue font-outfit text-white">
        <div className="mx-auto flex max-w-[1500px] gap-9 p-8">
          <Navbar />

          <div className="flex min-w-0 flex-1 flex-col gap-9">
            <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
              <Link
                to="/"
                className="shrink-0 text-3xl font-black tracking-[0.08em] text-red transition-colors duration-200 hover:text-red/80 sm:text-4xl"
                aria-label="WòFlix home"
              >
                WòFlix
              </Link>
              <div className="min-w-0 flex-1">
                <Search />
              </div>
            </header>

            <main className="overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AppLayout;
