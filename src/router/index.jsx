import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "../views/Root";
import ErrorView from "../views/Error";
import Home from "../views/Home";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import ProfileView from "../views/ProfileView.jsx/ProfileView";
import VideoChatView from "../views/VideoChatView";
import {
  SignUpView,
  SignInView,
  AuthenticationView,
} from "../views/Authentication";

const routes = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorView />,
    children: [
      {
        index: true,
        element: <Navigate to="home" />,
      },
      {
        path: "auth",
        element: <AuthenticationView />,
        children: [
          { index: true, path: "signin", element: <SignInView /> },
          { path: "signup", element: <SignUpView /> },
        ],
      },
      {
        path: "home",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
        children: [
          { index: true, path: "", element: <Navigate to="profile" /> },
          {
            path: "profile",
            element: (
              <PrivateRoute>
                <ProfileView />
              </PrivateRoute>
            ),
          },
          {
            path: "video-chat",
            element: (
              <PrivateRoute>
                <VideoChatView />
              </PrivateRoute>
            ),
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
