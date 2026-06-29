import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [value, setValue] = useState(searchParams.get("q") || "");
  const [holder, setHolder] = useState("");
  const isDetailRoute = location.pathname.match(/^\/(movie|tv)\/\d+$|^\/history$/);

  // Sync from URL when navigating to a new page
  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [location.pathname, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setValue(raw);
    setSearchParams(raw.trim() ? { q: raw } : {});
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setHolder("Search for movies or TV series");
    else if (path === "/movies") setHolder("Search for movies");
    else if (path === "/series") setHolder("Search for TV series");
    else setHolder("Search for Bookmarked Shows");
  }, [location.pathname]);

  if (isDetailRoute) return null;

  return (
    <div className="flex w-full items-center gap-4">
      <img
        src="/assets/icon-search.svg"
        alt="Search icon"
        className="h-5 w-5 object-contain sm:h-6 sm:w-6 lg:h-8 lg:w-8"
      />
      <input
        onChange={handleChange}
        value={value}
        type="text"
        placeholder={holder}
        className="w-full min-w-0 border-b border-b-darkBlue bg-darkBlue pb-2 font-light tracking-wide outline-none hover:cursor-pointer focus:border-b-grayishBlue sm:text-base lg:text-2xl"
      />
    </div>
  );
}

export default Search;
