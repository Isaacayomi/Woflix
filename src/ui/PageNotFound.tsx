import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "./SEO";

function PageNotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-semiDarkBlue text-center font-outfit text-grayishBlue">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />
      <h1 className="text-8xl font-bold text-white">{t("pageNotFound.heading")}</h1>
      <p className="mt-4 text-xl">
        {t("pageNotFound.message")}
      </p>
      <Link
        to="/"
        className="mt-8 rounded-lg bg-red px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-white hover:text-semiDarkBlue"
      >
        {t("pageNotFound.goHome")}
      </Link>
    </div>
  );
}

export default PageNotFound;
