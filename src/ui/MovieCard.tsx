import { useNavigate } from "react-router-dom";
import { useBookmark } from "../hooks/useBookmark";
import type { MoviesProps } from "types";
import Playicon from "./Playicon";
import SpinnerMini from "./SpinnerMini";

function MovieCard({ movie }: MoviesProps) {
  const navigate = useNavigate();
  const { bookmarked, isPending, handleClick } = useBookmark(movie);
  const { title, year, category, rating, thumbnail } = movie;
  const { regular } = thumbnail;

  const route = category === "tv series" ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  return (
    <div className="mb-4 flex flex-col">
      <div
        onClick={() => navigate(route)}
        style={{
          backgroundImage: regular.large && `url(${regular.large})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        className="group relative z-10 aspect-[16/9] w-full rounded-lg bg-cover bg-no-repeat md:cursor-pointer"
      >
        <div className="absolute inset-0 z-0 bg-black opacity-0 transition duration-300 group-hover:opacity-50"></div>

        <div className="z-20">
          <Playicon
            onClick={(e) => {
              e.stopPropagation();
              navigate(route);
            }}
            className="transition duration-300 md:flex md:group-hover:flex"
          />
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="opacity-[0.5006 ] absolute right-0 z-20 mr-[0.5rem] mt-[0.5rem] h-8 w-8 rounded-[2rem] bg-darkBlue md:mr-6"
        >
          {isPending ? (
            <div className="m-auto flex h-full items-center justify-center">
              <SpinnerMini />
            </div>
          ) : (
            <img
              src={
                bookmarked
                  ? "/assets/icon-bookmark-full.svg"
                  : "/assets/icon-bookmark-empty.svg"
              }
              alt="Bookmark icon"
              className="m-auto flex items-center justify-center py-[0.56rem]"
            />
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-normal text-white opacity-80 lg:text-[0.9375rem]">
          <p>{year}</p>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3"
              height="3"
              viewBox="0 0 3 3"
              fill="none"
            >
              <circle opacity="0.5" cx="1.5" cy="1.5" r="1.5" fill="white" />
            </svg>
          </span>
          <p className="flex items-center gap-[0.38rem]">
            <span>
              <img
                src={
                  category === "movie"
                    ? "/assets/icon-category-movies.svg"
                    : "/assets/icon-category-tv.svg"
                }
                alt={`${category} movie`}
              />
            </span>
            <span>{category}</span>
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="3"
            height="3"
            viewBox="0 0 3 3"
            fill="none"
          >
            <circle opacity="0.5" cx="1.5" cy="1.5" r="1.5" fill="white" />
          </svg>
          <p>{rating}</p>
        </div>

        <p className="text-[0.875rem] font-normal text-white lg:text-2xl">
          {title}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;
