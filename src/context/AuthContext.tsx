import { AuthProvider as NewAuthProvider } from "./auth.context";
import { useAuth as useNewAuth } from "../hooks/useAuth";

export const AuthProvider = NewAuthProvider;

export const useAuth = () => {
  const auth = useNewAuth();
  return {
    ...auth,
    signUp: auth.signup,
  };
};
