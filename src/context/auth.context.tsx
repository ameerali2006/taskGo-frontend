import React, { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { setAuth, setUser, removeUser, setLoading } from "../redux/authSlice";
import type { User } from "../redux/authSlice";
import { AuthService } from "../services/auth.service";
import type { RegisterUserDTO, LoginUserDTO } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (data: RegisterUserDTO) => Promise<void>;
  login: (data: LoginUserDTO) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  // Restore session on app load
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await AuthService.getMe();
        if (response.success && response.data) {
          dispatch(setUser(response.data));
        } else {
          dispatch(removeUser());
        }
      } catch (error) {
        dispatch(removeUser());
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchMe();
  }, [dispatch]);

  const signup = async (data: RegisterUserDTO) => {
    dispatch(setLoading(true));
    try {
      const response = await AuthService.signup(data);
      if (response.success && response.data) {
        dispatch(setAuth({ user: response.data, accessToken: response.accessToken }));
      } else {
        throw new Error(response.message || "Failed to sign up");
      }
    } catch (error: any) {
      dispatch(setLoading(false));
      throw error;
    }
  };

  const login = async (data: LoginUserDTO) => {
    dispatch(setLoading(true));
    try {
      const response = await AuthService.login(data);
      if (response.success && response.data) {
        dispatch(setAuth({ user: response.data, accessToken: response.accessToken }));
      } else {
        throw new Error(response.message || "Invalid credentials");
      }
    } catch (error: any) {
      dispatch(setLoading(false));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout failed on server", error);
    } finally {
      dispatch(removeUser());
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
