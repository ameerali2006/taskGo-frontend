import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import type { StatusDistribution } from "../../services/analytics.service";

interface StatusDistributionChartProps {
  data: StatusDistribution[];
}

const STATUS_COLORS: Record<string, string> = {
  Todo: "#3B82F6", // Blue
  "In Progress": "#8B5CF6", // Purple / Violet
  Completed: "#10B981", // Emerald
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-slate-900 text-white text-xs py-2 px-3 rounded-xl shadow-xl border border-slate-800 font-medium flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: item.payload.fill || item.color }}
        />
        <span>{item.name}:</span>
        <span className="font-bold text-white">{item.value} tasks</span>
      </div>
    );
  }
  return null;
};

export const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({
  data,
}) => {
  const chartData = data.map((item) => ({
    name: item.status,
    value: item.count,
  }));

  const total = chartData.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between h-[360px] w-full box-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5 text-left">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight m-0">
              Status Distribution
            </h3>
            <p className="text-xs text-slate-500 m-0">Tasks categorized by progress status</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          {total} Total
        </span>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
        {total === 0 ? (
          <div className="text-slate-400 text-xs font-medium text-center">
            No status data to display
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                cornerRadius={6}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={STATUS_COLORS[entry.name] || "#64748B"}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span className="text-xs font-semibold text-slate-700 mx-1">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
