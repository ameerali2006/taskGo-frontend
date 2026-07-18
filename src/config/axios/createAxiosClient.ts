import axios, { AxiosError } from "axios";
import type { AxiosInstance } from "axios";

interface CreateAxiosClientOptions {
  baseURL: string;
  refreshTokenEndpoint: string;
  loginRedirect: () => void;
  removeAuthAction: () => void;
}

export function createAxiosClient({
  baseURL,
  refreshTokenEndpoint,
  loginRedirect,
  removeAuthAction,
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
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;
      if (!originalRequest) {
        return Promise.reject(error);
      }

      // Avoid infinite loop if refresh token request itself fails
      if (originalRequest.url?.includes(refreshTokenEndpoint)) {
        isRefreshing = false;
        removeAuthAction();
        loginRedirect();
        return Promise.reject(error);
      }

      const responseStatus = error.response?.status;
      const responseData = error.response?.data as any;

      // Handle 401 Unauthorized / Token Expired
      if (
        responseStatus === 401 &&
        responseData?.message === "Token expired" &&
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
          await client.post(refreshTokenEndpoint);
          isRefreshing = false;
          processQueue(null);
          return client(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
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
