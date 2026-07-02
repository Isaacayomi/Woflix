import { useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Search from "../features/search/Search";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";

function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);

  const isDetailRoute = pathname.match(/^\/(movie|tv)\/\d+$/);
  const isHome = pathname === "/";
  const isCategoriesLanding = pathname === "/categories";

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-darkBlue font-outfit text-white">
        <div className="mx-auto flex max-w-[1500px] gap-9 p-8 pb-20 lg:pb-8">
          <Navbar />

          <div className="flex min-w-0 flex-1 flex-col gap-9">
            {!isDetailRoute && (
              <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
                {!isHome && (
                  <button
                    onClick={() => navigate(-1)}
                    className="shrink-0 text-white/60 transition-colors hover:text-white"
                    aria-label="Go back"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                )}
                <Link
                  to="/"
                  className="shrink-0 text-3xl font-black tracking-[0.08em] text-red transition-colors duration-200 hover:text-red/80 sm:text-4xl"
                  aria-label="WòFlix home"
                >
                  WòFlix
                </Link>
                {!isCategoriesLanding && (
                  <div className="min-w-0 flex-1">
                    <Search />
                  </div>
                )}
              </header>
            )}

            <main
              ref={mainRef}
              className="overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AppLayout;
