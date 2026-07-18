import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { BarChart3 } from "lucide-react";
import type { PriorityDistribution } from "../../services/analytics.service";

interface PriorityDistributionChartProps {
  data: PriorityDistribution[];
}

const PRIORITY_COLORS: Record<string, string> = {
  Low: "#10B981", // Emerald
  Medium: "#3B82F6", // Blue
  High: "#EF4444", // Rose / Red
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-slate-900 text-white text-xs py-2 px-3 rounded-xl shadow-xl border border-slate-800 font-medium flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: item.payload.fill || item.color }}
        />
        <span>{label} Priority:</span>
        <span className="font-bold text-white">{item.value} tasks</span>
      </div>
    );
  }
  return null;
};

export const PriorityDistributionChart: React.FC<PriorityDistributionChartProps> = ({
  data,
}) => {
  const chartData = data.map((item) => ({
    priority: item.priority,
    count: item.count,
  }));

  const total = chartData.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between h-[360px] w-full box-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5 text-left">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight m-0">
              Priority Distribution
            </h3>
            <p className="text-xs text-slate-500 m-0">Tasks breakdown by urgency level</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          {total} Total
        </span>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="priority"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={48}>
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.priority}`}
                  fill={PRIORITY_COLORS[entry.priority] || "#3B82F6"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
