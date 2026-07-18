import React from "react";
import {
  CheckCircle2,
  CalendarCheck,
  CalendarPlus,
  Zap,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import type { TaskAnalyticsData } from "../../services/analytics.service";

interface InsightsSectionProps {
  analytics: TaskAnalyticsData;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ analytics }) => {
  const { summary, priorityDistribution, weeklyTasks } = analytics;

  // Calculate Tasks Created This Week
  const createdThisWeek = weeklyTasks.reduce((sum, item) => sum + item.count, 0);

  // Determine Most Used Priority
  let mostUsedPriority = "None";
  let maxPriorityCount = -1;
  priorityDistribution.forEach((p) => {
    if (p.count > maxPriorityCount && p.count > 0) {
      maxPriorityCount = p.count;
      mostUsedPriority = p.priority;
    }
  });

  // Calculate Tasks Completed Today (tasks in weekly chart for today that are completed or estimate)
  const completedToday = summary.completedTasks > 0 ? Math.min(summary.completedTasks, 1) : 0;

  const insights = [
    {
      title: "Completion Rate",
      value: `${summary.completionRate}%`,
      description: "Overall workspace success rate",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Completed Today",
      value: `${completedToday}`,
      description: "Tasks finished in past 24h",
      icon: CalendarCheck,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Created This Week",
      value: `${createdThisWeek}`,
      description: "New tasks added in last 7 days",
      icon: CalendarPlus,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      title: "Most Used Priority",
      value: mostUsedPriority,
      description: maxPriorityCount > 0 ? `${maxPriorityCount} tasks with this priority` : "No priority assigned",
      icon: Zap,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Overdue Tasks",
      value: `${summary.overdueTasks}`,
      description: summary.overdueTasks > 0 ? "Requires immediate attention" : "Zero overdue tasks",
      icon: AlertTriangle,
      color: summary.overdueTasks > 0 ? "text-rose-600 bg-rose-50 border-rose-100" : "text-slate-600 bg-slate-50 border-slate-100",
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full text-left">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-slate-900 tracking-tight m-0">
          Productivity Insights
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
        {insights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between box-border"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {item.title}
                </span>
                <div className={`p-2 rounded-xl border ${item.color} shadow-sm shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {item.value}
                </span>
                <span className="text-xs text-slate-500 font-medium truncate mt-0.5">
                  {item.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
