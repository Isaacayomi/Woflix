import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import AppLayout from "./ui/AppLayout";
import Spinner from "./ui/Spinner";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import i18n from "./lib/i18n/config";

const Home = lazy(() => import("./features/home/Home"));
const Movies = lazy(() => import("./features/movies/Movies"));
const Series = lazy(() => import("./features/series/Series"));
const Bookmark = lazy(() => import("./features/bookmarks/Bookmark"));
const CategoriesPage = lazy(() => import("./features/categories/CategoriesPage"));
const CategoryResults = lazy(() => import("./features/categories/CategoryResults"));
const DecadeResults = lazy(() => import("./features/browse/DecadeResults"));
const LanguageResults = lazy(() => import("./features/browse/LanguageResults"));
const PlatformResults = lazy(() => import("./features/platforms/PlatformResults"));
const CollectionPage = lazy(() => import("./features/collection/CollectionPage"));
const DetailPage = lazy(() => import("./features/detail/DetailPage"));
const History = lazy(() => import("./features/history/History"));
const Profile = lazy(() => import("./features/profile/Profile"));
const Admin = lazy(() => import("./features/admin/Admin"));
const Login = lazy(() => import("./features/authentication/Login"));
const SignUp = lazy(() => import("./features/authentication/SignUp"));
const PageNotFound = lazy(() => import("./ui/PageNotFound"));

function LanguageChangeHandler() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handle = (lng: string) => {
      localStorage.setItem("language", lng);
      queryClient.invalidateQueries();
    };
    i18n.on("languageChanged", handle);
    return () => i18n.off("languageChanged", handle);
  }, [queryClient]);

  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true,
    },
  },
});

function App() {

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <LanguageChangeHandler />
        <Suspense fallback={<Spinner />}>
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
            <Route element={<Admin />} path="admin" />
          </Route>
          <Route element={<Login />} path="login" />
          <Route element={<SignUp />} path="sign-up" />
          <Route element={<PageNotFound />} path="*" />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
