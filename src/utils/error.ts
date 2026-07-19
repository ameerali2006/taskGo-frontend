/**
 * Utility to extract meaningful error messages from API responses, Network failures, or standard errors.
 */
export const getErrorMessage = (error: any, fallbackMessage: string): string => {
  if (!error) return fallbackMessage;

  // Handle Axios response error with backend message
  if (error.response) {
    const status = error.response.status;
    const backendMessage = error.response.data?.message || error.response.data?.error;

    if (backendMessage && typeof backendMessage === "string") {
      return backendMessage;
    }

    if (status === 401) {
      return "Session expired. Please login again.";
    }
    if (status === 403) {
      return "Unauthorized access. You do not have permission.";
    }
    if (status === 404) {
      return "Resource not found.";
    }
    if (status >= 500) {
      return "Internal server error. Please try again later.";
    }
  }

  // Handle Network Error (offline / unreachable backend)
  if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
    return "Network connection lost. Please check your connection.";
  }

  // Handle standard Error object
  if (typeof error?.message === "string" && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
};
