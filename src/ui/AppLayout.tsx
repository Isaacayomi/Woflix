import { Outlet } from "react-router-dom";
import { MovieProvider } from "../context/MovieContext";
import Search from "../features/search/Search";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";
import MoviePreviewWrapper from "./MoviePreviewWrapper";

function AppLayout() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-darkBlue font-outfit text-white">
        <div className="mx-auto grid max-w-[1500px] gap-9 p-8 sm:grid-cols-[1fr] sm:grid-rows-[1fr] lg:grid-cols-[6rem_1fr] lg:grid-rows-[auto_1fr]">
          <Navbar />

          <MovieProvider>
            <Search />

            <main className="overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Outlet />
              <MoviePreviewWrapper />
            </main>
          </MovieProvider>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AppLayout;
