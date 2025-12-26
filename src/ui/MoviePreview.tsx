import { useState } from "react";
import { MoviePreviewProps } from "types";

function MoviePreview({ movie, onClose }: MoviePreviewProps) {
  const [playing, setPlaying] = useState(false);

  const imageUrl =
    movie.thumbnail.trending?.large || movie.thumbnail.regular.large;

  const embedUrl = movie.videoUrl
    ? movie.videoUrl.split("&")[0].replace("watch?v=", "embed/")
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-[92%] max-w-4xl overflow-hidden rounded-xl bg-darkBlue shadow-xl">
        <div className="relative aspect-video bg-black">
          {embedUrl && playing ? (
            <iframe
              className="h-full w-full"
              src={embedUrl}
              title={movie.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img
              src={imageUrl}
              alt={movie.title}
              className="h-full w-full object-cover opacity-80"
            />
          )}

          {!playing && embedUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setPlaying(true)}
                className="flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 backdrop-blur-md hover:bg-white/20"
              >
                ▶
                <span className="text-sm font-medium text-white">
                  Play demo
                </span>
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white hover:bg-black/80"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 p-6">
          <h2 className="text-xl font-semibold">{movie.title}</h2>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.category}</span>
            <span>•</span>
            <span>{movie.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoviePreview;
