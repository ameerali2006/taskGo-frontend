import React from "react";

export const SkeletonPulse: React.FC<{ className?: string }> = ({ className = "" }) => {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-[16px] p-6 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <SkeletonPulse className="h-4 w-24" />
        <SkeletonPulse className="h-8 w-8 rounded-full" />
      </div>
      <SkeletonPulse className="h-8 w-16" />
      <SkeletonPulse className="h-3.5 w-32 mt-2" />
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-[16px] overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <SkeletonPulse className="h-6 w-32" />
        <div className="flex gap-2">
          <SkeletonPulse className="h-9 w-24 rounded-lg" />
          <SkeletonPulse className="h-9 w-24 rounded-lg" />
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 flex items-center justify-between">
            <div className="flex flex-col gap-2 flex-grow">
              <SkeletonPulse className="h-4 w-1/3" />
              <SkeletonPulse className="h-3 w-1/4" />
            </div>
            <div className="flex items-center gap-6">
              <SkeletonPulse className="h-6 w-16 rounded-full" />
              <SkeletonPulse className="h-6 w-16 rounded-full" />
              <SkeletonPulse className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ButtonSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return <SkeletonPulse className={`h-[50px] w-full rounded-[16px] ${className}`} />;
};
