import React from "react";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#262626]/80 ${className}`}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl flex flex-col h-[100px] p-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-8 rounded" />
      </div>
      <Skeleton className="h-8 w-24 mt-2" />
      <Skeleton className="h-2 w-12 mt-1" />
      <div className="flex items-end gap-[1px] mt-auto h-8 z-10">
        {Array.from({ length: 15 }).map((_, i) => (
          <Skeleton key={i} className="flex-1 rounded-t-[1px]" style={{ height: `${20 + ((i * 17) % 75)}%` }} />
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-gradient-to-b from-[#181818] to-[#121212] border border-white/[0.04] rounded-xl p-6 shadow-xl w-full h-[320px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-4" />
      </div>
      <div className="flex-1 flex items-end gap-2 w-full relative">
        {/* Fake Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-2">
          <Skeleton className="h-[1px] w-full opacity-20" />
          <Skeleton className="h-[1px] w-full opacity-20" />
          <Skeleton className="h-[1px] w-full opacity-20" />
          <Skeleton className="h-[1px] w-full opacity-20" />
        </div>
        
        {/* Fake chart bars/area */}
        {Array.from({ length: 30 }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="flex-1 rounded-t-sm opacity-40 bg-[#2266ec]" 
            style={{ 
              height: `${30 + Math.sin(i * 0.5) * 20 + ((i * 13) % 40)}%`,
              animationDelay: `${i * 0.05}s`
            }} 
          />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
      </div>
    </div>
  );
}
