import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  console.log({ currentUser });
  if (!currentUser) {
    return <Navigate to="/auth/signin" replace={true} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
