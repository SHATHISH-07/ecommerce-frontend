import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

const GuestRoute = () => {
  const user = useSelector((state: RootState) => state.user.user);

  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default GuestRoute;
