import React from "react";

export const AnalyticsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse">
      {/* 5 Summary Cards Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-28 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 bg-slate-200 rounded-md w-20" />
              <div className="w-8 h-8 bg-slate-100 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="h-7 bg-slate-200 rounded-lg w-14" />
              <div className="h-3 bg-slate-100 rounded-md w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* 2 Distribution Charts Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="h-[360px] bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 bg-slate-200 rounded-md w-36" />
              <div className="h-3 bg-slate-100 rounded-md w-48" />
            </div>
            <div className="h-6 bg-slate-100 rounded-full w-16" />
          </div>
          <div className="w-40 h-40 bg-slate-100 rounded-full mx-auto my-auto" />
        </div>

        <div className="h-[360px] bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 bg-slate-200 rounded-md w-36" />
              <div className="h-3 bg-slate-100 rounded-md w-48" />
            </div>
            <div className="h-6 bg-slate-100 rounded-full w-16" />
          </div>
          <div className="h-48 bg-slate-50 rounded-xl w-full mt-4 flex items-end justify-around p-4">
            <div className="w-12 h-20 bg-slate-200 rounded-t-lg" />
            <div className="w-12 h-32 bg-slate-200 rounded-t-lg" />
            <div className="w-12 h-16 bg-slate-200 rounded-t-lg" />
          </div>
        </div>
      </div>

      {/* 1 Weekly Line Chart Skeleton */}
      <div className="h-[340px] bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 rounded-md w-44" />
            <div className="h-3 bg-slate-100 rounded-md w-56" />
          </div>
          <div className="h-6 bg-slate-100 rounded-full w-24" />
        </div>
        <div className="h-44 bg-slate-50 rounded-xl w-full mt-4" />
      </div>
    </div>
  );
};
