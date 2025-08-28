import React from 'react';

const StatCard: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
    <div className="bg-slate-200/50 dark:bg-slate-700/50 p-4 rounded-lg text-center transform transition-transform hover:scale-105">
        <p className="text-3xl font-bold text-pink-500 dark:text-pink-400 transition-colors">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    </div>
);

export default StatCard;