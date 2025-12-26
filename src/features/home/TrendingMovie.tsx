import "swiper/css";
import "swiper/css/free-mode";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { useTrendingMovies } from "../../hooks/useTrendingMovie";
import TrendingMovieCard from "./TrendingMovieCard";

function TrendingMovie() {
  const { trendingMovies, isPending } = useTrendingMovies();

  if (isPending) return <p className="text-white">Loading...</p>;

  return (
    <Swiper
      modules={[Autoplay, FreeMode]}
      spaceBetween={32}
      freeMode
      loop
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        320: { slidesPerView: 1.2, spaceBetween: 6 },
        // 480: { slidesPerView: 1.6, spaceBetween: 8 },
        640: { slidesPerView: 2.2, spaceBetween: 12 },
      }}
    >
      {trendingMovies?.map((movie) => (
        <SwiperSlide key={movie.id}>
          <TrendingMovieCard movie={movie} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default TrendingMovie;
