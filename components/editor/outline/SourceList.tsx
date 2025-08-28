import React from 'react';
// FIX: Correct import path for types
import { Source } from '../../../types/index';

interface SourceListProps {
  sources: Source[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Sources Used:</h3>
      <ul className="list-disc list-inside space-y-1 text-sm text-pink-600 dark:text-pink-400">
        {sources.map((source, index) => (
          <li key={index}>
            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="hover:underline" title={source.web.uri}>
              {source.web.title || source.web.uri}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SourceList;