import React from 'react';

const ActionMenuItem: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, disabled = false, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-wait disabled:hover:bg-transparent dark:disabled:hover:bg-transparent transition-colors rounded-md"
    role="menuitem"
  >
    {children}
  </button>
);

export default ActionMenuItem;
