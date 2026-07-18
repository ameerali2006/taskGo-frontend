import React from "react";
import { BarChart3, Plus } from "lucide-react";
import { Button } from "../Button";

interface AnalyticsEmptyStateProps {
  onCreateTask: () => void;
}

export const AnalyticsEmptyState: React.FC<AnalyticsEmptyStateProps> = ({
  onCreateTask,
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden text-left flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700/50">
      {/* Decorative Blob Background */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-5 z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
          <BarChart3 className="w-7 h-7 text-blue-400" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-white tracking-tight m-0">
            No Analytics Available
          </h3>
          <p className="text-sm text-slate-300 m-0">
            Create your first task to see statistics, progress tracking, and productivity charts.
          </p>
        </div>
      </div>

      <Button
        onClick={onCreateTask}
        className="z-10 shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-semibold border-none px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30"
      >
        <Plus className="w-4.5 h-4.5" />
        <span>Create First Task</span>
      </Button>
    </div>
  );
};
