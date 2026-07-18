import React from "react";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import type { TaskSummary } from "../../services/analytics.service";

interface AnalyticsSummaryCardsProps {
  summary: TaskSummary;
}

export const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({
  summary,
}) => {
  const cards = [
    {
      title: "Total Tasks",
      value: summary.totalTasks,
      description: "All workspace tasks",
      icon: ClipboardList,
      color: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50 text-blue-600 border-blue-100",
      accent: "text-blue-600",
      gradientBlob: "from-blue-500/10 to-indigo-500/5",
    },
    {
      title: "Completed",
      value: summary.completedTasks,
      description: `${summary.completionRate}% completion rate`,
      icon: CheckCircle2,
      color: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      accent: "text-emerald-600",
      gradientBlob: "from-emerald-500/10 to-teal-500/5",
    },
    {
      title: "Pending",
      value: summary.pendingTasks,
      description: "Awaiting action",
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      lightBg: "bg-amber-50 text-amber-600 border-amber-100",
      accent: "text-amber-600",
      gradientBlob: "from-amber-500/10 to-orange-500/5",
    },
    {
      title: "In Progress",
      value: summary.inProgressTasks,
      description: "Active execution",
      icon: Activity,
      color: "from-purple-500 to-violet-600",
      lightBg: "bg-purple-50 text-purple-600 border-purple-100",
      accent: "text-purple-600",
      gradientBlob: "from-purple-500/10 to-violet-500/5",
    },
    {
      title: "Overdue",
      value: summary.overdueTasks,
      description: summary.overdueTasks > 0 ? "Requires immediate action" : "On schedule",
      icon: AlertTriangle,
      color: "from-rose-500 to-red-600",
      lightBg: summary.overdueTasks > 0 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-500 border-slate-100",
      accent: summary.overdueTasks > 0 ? "text-rose-600" : "text-slate-500",
      gradientBlob: "from-rose-500/10 to-red-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all group box-border"
          >
            {/* Background Soft Radial Gradient Blob */}
            <div
              className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradientBlob} blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`}
            />

            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.lightBg} shadow-sm shrink-0`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="flex flex-col gap-1 text-left">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                {card.value}
              </span>
              <span className={`text-xs font-medium ${card.accent} mt-1 truncate`}>
                {card.description}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
