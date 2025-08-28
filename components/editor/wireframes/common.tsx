import React from 'react';

export const WireframeBox: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-28 h-20 bg-white dark:bg-slate-900 rounded-md p-2 flex flex-col gap-1 border border-slate-300 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);

export const TitleBar = () => <div className="h-2 bg-pink-500/80 rounded-sm w-3/4 flex-shrink-0"></div>;
export const TextLine = ({ width = 'full' }: { width?: string }) => <div className={`h-1.5 bg-slate-400 dark:bg-slate-600 rounded-sm w-${width}`}></div>;
export const ImageBox = () => <div className="flex-grow bg-purple-200 dark:bg-purple-600/30 rounded-sm"></div>;