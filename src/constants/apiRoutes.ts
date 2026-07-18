export const apiRoutes = {
  auth: {
    signup: "/auth/signup",
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
    refreshToken: "/auth/refresh-token",
  },
  tasks: {
    base: "/tasks",
    analytics: "/tasks/analytics",
    byId: (id: string) => `/tasks/${id}`,
  },
};
