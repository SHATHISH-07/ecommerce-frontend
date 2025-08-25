import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

const PrivateRoute = () => {
  const user = useSelector((state: RootState) => state.user.user);

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default PrivateRoute;
