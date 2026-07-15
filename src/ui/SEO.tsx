import { Helmet } from "react-helmet-async";

const SITE_NAME = "WòFlix";
const DEFAULT_DESCRIPTION =
  "Stream movies and TV shows. Browse trending titles, create your watchlist, and discover what to watch next.";
const DEFAULT_IMAGE = "/favicon-32x32.svg";

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "video.movie" | "video.tv";
};

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  url,
  type = "website",
}: SEOProps) {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const imageUrl = image || `${origin}${DEFAULT_IMAGE}`;
  const pageUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      <link rel="canonical" href={pageUrl} />
    </Helmet>
  );
}
