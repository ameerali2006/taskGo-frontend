import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { AnalyticsService } from "../services/analytics.service";
import type { TaskAnalyticsData } from "../services/analytics.service";
import { AnalyticsSummaryCards } from "../components/analytics/AnalyticsSummaryCards";
import { StatusDistributionChart } from "../components/analytics/StatusDistributionChart";
import { PriorityDistributionChart } from "../components/analytics/PriorityDistributionChart";
import { WeeklyProductivityChart } from "../components/analytics/WeeklyProductivityChart";
import { CompletionRateGauge } from "../components/analytics/CompletionRateGauge";
import { InsightsSection } from "../components/analytics/InsightsSection";
import { AnalyticsSkeleton } from "../components/analytics/AnalyticsSkeleton";
import { AnalyticsEmptyState } from "../components/analytics/AnalyticsEmptyState";
import { useNavigate } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<TaskAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await AnalyticsService.getAnalytics();
      if (response.success && response.data) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleNavigateToTasks = () => {
    navigate("/tasks");
  };

  return (
    <DashboardLayout>
      {/* 1. Header */}
      <div className="flex flex-col gap-1 w-full text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight m-0">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 m-0">
          Welcome Back, <span className="text-slate-900 font-semibold">{user?.name || "User"}</span>. Here's an overview of your task productivity.
        </p>
      </div>

      {/* 2. Main Content */}
      {loading ? (
        <AnalyticsSkeleton />
      ) : !analytics || analytics.summary.totalTasks === 0 ? (
        <AnalyticsEmptyState onCreateTask={handleNavigateToTasks} />
      ) : (
        <div className="flex flex-col gap-8 w-full">
          {/* Statistics Cards */}
          <AnalyticsSummaryCards summary={analytics.summary} />

          {/* Analytics Section - Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <StatusDistributionChart data={analytics.statusDistribution} />
            <PriorityDistributionChart data={analytics.priorityDistribution} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <div className="lg:col-span-2">
              <WeeklyProductivityChart data={analytics.weeklyTasks} />
            </div>
            <div className="lg:col-span-1">
              <CompletionRateGauge
                rate={analytics.summary.completionRate}
                completedTasks={analytics.summary.completedTasks}
                totalTasks={analytics.summary.totalTasks}
              />
            </div>
          </div>

          {/* Insights Section */}
          <InsightsSection analytics={analytics} />
        </div>
      )}
    </DashboardLayout>
  );
};
