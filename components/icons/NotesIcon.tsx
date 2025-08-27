import React from 'react';

export const NotesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M8 6h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2z" />
    <path d="M16 4h2a2 2 0 0 1 2 2v2" />
    <path d="M8 20H6a2 2 0 0 1-2-2v-2" />
    <path d="M12 11h4" />
    <path d="M12 15h4" />
    <path d="M8 11h.01" />
    <path d="M8 15h.01" />
  </svg>
);
