import { userAxios } from "../config/axios/userAxios";
import { apiRoutes } from "../constants/apiRoutes";

export interface TaskSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface StatusDistribution {
  status: "Todo" | "In Progress" | "Completed";
  count: number;
}

export interface PriorityDistribution {
  priority: "Low" | "Medium" | "High";
  count: number;
}

export interface WeeklyTask {
  day: string;
  count: number;
}

export interface MonthlyTask {
  month: string;
  count: number;
}

export interface TaskAnalyticsData {
  summary: TaskSummary;
  statusDistribution: StatusDistribution[];
  priorityDistribution: PriorityDistribution[];
  weeklyTasks: WeeklyTask[];
  monthlyTasks: MonthlyTask[];
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data?: TaskAnalyticsData;
}

export class AnalyticsService {
  static async getAnalytics(): Promise<AnalyticsResponse> {
    const response = await userAxios.get<AnalyticsResponse>(apiRoutes.tasks.analytics);
    return response.data;
  }
}
