import { userAxios } from "../config/axios/userAxios";
import { apiRoutes } from "../constants/apiRoutes";

export interface Task {
  id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "In Progress" | "Completed";
  dueDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export class TaskService {
  static async getTasks(): Promise<ApiResponse<Task[]>> {
    const response = await userAxios.get<ApiResponse<Task[]>>(apiRoutes.tasks.base);
    return response.data;
  }

  static async createTask(data: Omit<Task, "id">): Promise<ApiResponse<Task>> {
    console.log(data)
    const response = await userAxios.post<ApiResponse<Task>>(apiRoutes.tasks.base, data);
    console.log(response)
    return response.data;
  }

  static async updateTask(id: string, data: Partial<Task>): Promise<ApiResponse<Task>> {
    const response = await userAxios.put<ApiResponse<Task>>(apiRoutes.tasks.byId(id), data);
    return response.data;
  }

  static async deleteTask(id: string): Promise<ApiResponse<void>> {
    const response = await userAxios.delete<ApiResponse<void>>(apiRoutes.tasks.byId(id));
    return response.data;
  }
}
