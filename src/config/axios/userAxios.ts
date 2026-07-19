import { createAxiosClient } from "./createAxiosClient";
import { store } from "../../redux/store";
import { removeUser } from "../../redux/authSlice";
import { apiRoutes } from "../../constants/apiRoutes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const userAxios = createAxiosClient({
  baseURL: API_BASE_URL,
  refreshTokenEndpoint: apiRoutes.auth.refreshToken,
  loginRedirect: () => {
    window.location.href = "/login";
  },
  removeAuthAction: () => {
    store.dispatch(removeUser());
  },
});
