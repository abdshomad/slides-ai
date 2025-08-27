import React from 'react';

export const ExpandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 21H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h3"/>
    <path d="M17 3h3a2 2 0 0 1 2 2v3"/>
    <path d="M21 17v3a2 2 0 0 1-2 2h-3"/>
    <path d="M3 17v3a2 2 0 0 0 2 2h3"/>
    <path d="m14 10-4 4"/>
    <path d="M10 10h4v4"/>
  </svg>
);
