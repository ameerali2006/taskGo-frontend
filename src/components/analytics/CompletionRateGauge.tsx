import React from "react";
import { Target } from "lucide-react";

interface CompletionRateGaugeProps {
  rate: number;
  completedTasks: number;
  totalTasks: number;
}

export const CompletionRateGauge: React.FC<CompletionRateGaugeProps> = ({
  rate,
  completedTasks,
  totalTasks,
}) => {
  // SVG Circle Parameters
  const size = 180;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rate / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between h-[360px] w-full box-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5 text-left">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight m-0">
              Completion Rate
            </h3>
            <p className="text-xs text-slate-500 m-0">Overall task goal fulfillment</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
          {rate}% Done
        </span>
      </div>

      {/* Circular Progress Gauge */}
      <div className="flex-1 w-full min-h-0 flex flex-col items-center justify-center relative">
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Track Circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Fill Circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="url(#completionGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="completionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
              {rate}%
            </span>
            <span className="text-[11px] font-semibold text-slate-400 mt-1">
              Completed
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center">
          <span className="text-xs font-medium text-slate-500">
            <strong className="text-slate-800 font-bold">{completedTasks}</strong> of{" "}
            <strong className="text-slate-800 font-bold">{totalTasks}</strong> tasks finished
          </span>
        </div>
      </div>
    </div>
  );
};
