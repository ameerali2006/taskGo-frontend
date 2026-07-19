import { userAxios } from "../config/axios/userAxios";
import { apiRoutes } from "../constants/apiRoutes";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  accessToken?: string;
}

export interface RegisterUserDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export class AuthService {
  static async signup(data: RegisterUserDTO): Promise<ApiResponse<User>> {
    const response = await userAxios.post<ApiResponse<User>>(apiRoutes.auth.signup, data);
    return response.data;
  }

  static async login(data: LoginUserDTO): Promise<ApiResponse<User>> {
    const response = await userAxios.post<ApiResponse<User>>(apiRoutes.auth.login, data);
    console.log("response of login",response)
    return response.data;
  }

  static async logout(): Promise<ApiResponse<void>> {
    const response = await userAxios.post<ApiResponse<void>>(apiRoutes.auth.logout);
    return response.data;
  }

  static async refreshToken(): Promise<ApiResponse<void>> {
    const response = await userAxios.post<ApiResponse<void>>(apiRoutes.auth.refreshToken);
    return response.data;
  }

  static async getMe(): Promise<ApiResponse<User>> {
    const response = await userAxios.get<ApiResponse<User>>(apiRoutes.auth.me);
    return response.data;
  }
}
