import React from 'react';
import Loader from '../../Loader';
import LoadingProgress from '../LoadingProgress';

interface AsyncTaskIndicatorProps {
  isLoading: boolean;
  loadingMessage: string;
  elapsedTime: number;
  estimatedTime: number;
}

const AsyncTaskIndicator: React.FC<AsyncTaskIndicatorProps> = (props) => {
  const { isLoading, loadingMessage, elapsedTime, estimatedTime } = props;

  if (!isLoading) return null;

  return (
    <div className="text-center p-3 mb-6 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg animate-fade-in" role="status">
      <div className="inline-flex items-center">
        <Loader />
        <p className="ml-3 text-slate-700 dark:text-slate-300">{loadingMessage}</p>
      </div>
      <LoadingProgress elapsedTime={elapsedTime} estimatedTime={estimatedTime} />
    </div>
  );
};

export default AsyncTaskIndicator;