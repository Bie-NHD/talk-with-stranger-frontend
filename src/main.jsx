import React from "react";
import ReactDOM from "react-dom/client";
import App from "./views/App.jsx";
import "./styles/global.scss";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./store/theme.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Provider } from "react-redux";
import store from "./store/index.js";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
