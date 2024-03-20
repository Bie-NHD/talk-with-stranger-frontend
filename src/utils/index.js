import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

export const isJWTExpired = (jwt) => {
  const decoded = jwtDecode(jwt);

  const isExipred = Date.now() >= decoded.exp * 1000;

  return isExipred;
};

export const getJWTExp = (jwt) => {
  const decoded = jwtDecode(jwt);

  return decoded.exp;
};

export const getJWTDuration = (jwt) => {
  const decoded = jwtDecode(jwt);

  const expMillis = moment(decoded.exp * 1000);
  const now = moment();

  const daysDiff = expMillis.diff(now, "days");

  return daysDiff;
};

export const setUserCookies = ({ uid, refreshToken }) => {
  Cookie.set("refreshToken", refreshToken, {
    expires: new Date(getJWTExp(refreshToken) * 1000),
  });

  Cookie.set("uid", uid, {
    expires: new Date(getJWTExp(refreshToken) * 1000),
  });
};

export const clearUserCookies = () => {
  Cookie.remove("uid");
  Cookie.remove("refreshToken");
};
