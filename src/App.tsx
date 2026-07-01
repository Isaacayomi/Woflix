import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./features/home/Home";
import Movies from "./features/movies/Movies";
import Series from "./features/series/Series";
import Bookmark from "./features/bookmarks/Bookmark";
import CategoriesPage from "./features/categories/CategoriesPage";
import CategoryResults from "./features/categories/CategoryResults";
import DecadeResults from "./features/browse/DecadeResults";
import LanguageResults from "./features/browse/LanguageResults";
import PlatformResults from "./features/platforms/PlatformResults";
import CollectionPage from "./features/collection/CollectionPage";
import DetailPage from "./features/detail/DetailPage";
import AppLayout from "./ui/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PageNotFound from "./ui/PageNotFound";
import Login from "./features/authentication/Login";
import SignUp from "./features/authentication/SignUp";
import Profile from "./features/profile/Profile";
import History from "./features/history/History";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        experimental_prefetchInRender: true,
      },
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route element={<AppLayout />}>
            <Route element={<Home />} path="/" />
            <Route element={<Movies />} path="movies" />
            <Route element={<Series />} path="series" />
            <Route element={<Bookmark />} path="bookmarks" />
            <Route element={<CategoriesPage />} path="categories" />
            <Route element={<CategoryResults />} path="categories/:genreId" />
            <Route element={<DecadeResults />} path="browse/decade/:year" />
            <Route element={<LanguageResults />} path="browse/language/:code" />
            <Route element={<PlatformResults />} path="platform/:providerId" />
            <Route element={<CollectionPage />} path="collection/:id" />
            <Route element={<DetailPage />} path="movie/:id" />
            <Route element={<DetailPage />} path="tv/:id" />
            <Route element={<History />} path="history" />
            <Route element={<Profile />} path="profile" />
          </Route>
          <Route element={<Login />} path="login" />
          <Route element={<SignUp />} path="sign-up" />
          <Route element={<PageNotFound />} path="*" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
