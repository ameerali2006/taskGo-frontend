import axios, { AxiosError } from "axios";
import type { AxiosInstance } from "axios";

interface CreateAxiosClientOptions {
  baseURL: string;
  refreshTokenEndpoint: string;
  loginRedirect: () => void;
  removeAuthAction: () => void;
  getToken?: () => string | null;
  setAccessTokenAction?: (token: string | null) => void;
}

export function createAxiosClient({
  baseURL,
  refreshTokenEndpoint,
  loginRedirect,
  removeAuthAction,
  getToken,
  setAccessTokenAction,
}: CreateAxiosClientOptions): AxiosInstance {
  const client = axios.create({
    baseURL,
    withCredentials: true,
  });

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error: any) => void;
  }> = [];

  const processQueue = (error: any) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve();
      }
    });
    failedQueue = [];
  };

  // Request Interceptor
  client.interceptors.request.use(
    (config) => {
      const token = getToken ? getToken() : null;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  client.interceptors.response.use(
    (response) => {
      if (response.data && response.data.accessToken && setAccessTokenAction) {
        setAccessTokenAction(response.data.accessToken);
      }
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config;
      if (!originalRequest) {
        return Promise.reject(error);
      }

      // Avoid infinite loop if refresh token request itself fails
      if (originalRequest.url?.includes(refreshTokenEndpoint)) {
        isRefreshing = false;
        if (setAccessTokenAction) {
          setAccessTokenAction(null);
        }
        removeAuthAction();
        loginRedirect();
        return Promise.reject(error);
      }

      const responseStatus = error.response?.status;

      // Handle 401 Unauthorized / Token Expired
      if (
        responseStatus === 401 &&
        !(originalRequest as any)._retry
      ) {
        (originalRequest as any)._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        isRefreshing = true;

        try {
          // POST call to refresh token endpoint
          const res = await client.post(refreshTokenEndpoint);
          if (res.data?.accessToken && setAccessTokenAction) {
            setAccessTokenAction(res.data.accessToken);
          }
          isRefreshing = false;
          processQueue(null);
          return client(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          if (setAccessTokenAction) {
            setAccessTokenAction(null);
          }
          processQueue(refreshError);
          removeAuthAction();
          loginRedirect();
          return Promise.reject(refreshError);
        }
      }

      // Handle other status codes
      if (responseStatus === 403) {
        console.error("403 Forbidden Access");
      } else if (responseStatus === 500) {
        console.error("500 Internal Server Error");
      } else if (!error.response) {
        console.error("Network Error: check connection");
      }

      return Promise.reject(error);
    }
  );

  return client;
}
