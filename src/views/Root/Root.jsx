import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { resetToast } from "../../store/toastSlice";

const RootView = () => {
  const { type, message } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "error":
        toast.error(message);
        break;
      default:
        break;
    }
    dispatch(resetToast());
  }, [type, message]);

  // useEffect(() => {
  //   const refreshTokenStore = Cookie.get("refreshToken");
  //   const uid = Cookie.get("uid");

  //   if (refreshTokenStore && uid) {
  //     dispatch(refreshToken({ refreshToken: refreshTokenStore, uid }));
  //   }
  // }, [dispatch]);

  return (
    <main
      style={{
        minWidth: "100vw",
        minHeight: "100vh",
      }}
    >
      <Outlet />
    </main>
  );
};

export default RootView;
