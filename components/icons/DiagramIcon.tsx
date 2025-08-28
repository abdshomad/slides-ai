import React from 'react';

export const DiagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M5 10v4" />
    <path d="M19 10v4" />
    <path d="M2 12h3" />
    <path d="M19 12h3" />
    <path d="M5 12h14" />
    <path d="m12 5 3 3" />
    <path d="m9 8-3-3" />
    <path d="m12 19-3-3" />
    <path d="m15 16 3 3" />
  </svg>
);