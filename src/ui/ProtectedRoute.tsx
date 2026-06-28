import { useUser } from "../hooks/useUser";
import { ButtonProp } from "types";
import Spinner from "./Spinner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }: ButtonProp) {
  const navigate = useNavigate();
  const { isPending, isAuthenticated } = useUser();

  useEffect(
    function () {
      if (!isAuthenticated && !isPending) {
        navigate("/login");
      }
    },
    [isAuthenticated, isPending, navigate],
  );

  if (isPending) return <Spinner />;

  if (!isAuthenticated) return null;

  return children;
}
export default ProtectedRoute;
