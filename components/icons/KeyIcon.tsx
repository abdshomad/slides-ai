import React from 'react';

export const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M12 15v5" />
    <path d="M12 9V4" />
    <path d="m15 12-5-3" />
    <path d="m15 12 5-3" />
    <path d="m9 12-5 3" />
    <path d="m9 12 5 3" />
  </svg>
);