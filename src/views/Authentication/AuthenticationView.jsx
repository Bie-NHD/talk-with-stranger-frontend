import { Outlet } from "react-router-dom";
import { Container, CssBaseline } from "@mui/material";
import classes from "./AuthenticationView.module.scss";

const AuthenticationView = () => {
  return (
    <div className={classes.container}>
      <CssBaseline />
      <Outlet />
    </div>
  );
};

export default AuthenticationView;
