import { createAxiosClient } from "./createAxiosClient";
import { store } from "../../redux/store";
import { removeUser } from "../../redux/authSlice";
import { env } from "../../env/env";
import { apiRoutes } from "../../constants/apiRoutes";

export const userAxios = createAxiosClient({
  baseURL: env.API_BASE_URL,
  refreshTokenEndpoint: apiRoutes.auth.refreshToken,
  loginRedirect: () => {
    window.location.href = "/login";
  },
  removeAuthAction: () => {
    store.dispatch(removeUser());
  },
});
