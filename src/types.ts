export type Thumbnail = {
  trending?: {
    small: string;
    large: string;
  };
  regular: {
    small: string;
    medium: string;
    large: string;
  };
};

export type Movie = {
  id: number;
  title: string;
  year: number;
  rating: string;
  category: string;
  thumbnail: Thumbnail;
  isBookmarked: boolean;
};

export type MoviesProps = {
  movie: Movie;
};

export type HeadingProp = {
  children: React.ReactNode;
};

export type ButtonProp = {
  children: React.ReactNode;
};

export type PlayIconProps = {
  className: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export type AuthProps = {
  email: string;
  password: string;
  confirmPassword?: string;
  message?: string;
};

export type MovieContextType = {
  baseMovies: Movie[];
  allMovies: Movie[];
  movies: Movie[];
  series: Movie[];
  bookmarked: Movie[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setBaseMovies: (movies: Movie[]) => void;

  showPreview: boolean;
  setShowPreview: (show: boolean) => void;

  previewMovie: Movie | null;
  setPreviewMovie: (movie: Movie | null) => void;

  openPreview: (movie: Movie) => void;
  closePreview: () => void;
};
