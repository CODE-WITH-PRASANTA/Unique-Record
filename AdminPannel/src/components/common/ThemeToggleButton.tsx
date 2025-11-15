// File: components/common/ThemeToggleButton.tsx
import React from "react";

export const ThemeToggleButton: React.FC = () => {
  return (
    <button
      className="flex items-center justify-center text-gray-600 transition-colors bg-white border border-gray-200 rounded-full h-11 w-11 hover:bg-gray-100 hover:text-gray-800"
      disabled
      title="Light mode only"
    >
      {/* Sun Icon (Light Mode Indicator) */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 1.5a.75.75 0 0 1 .75.75V3a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 10 1.5ZM10 16.5a.75.75 0 0 1 .75.75V18a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Zm8.5-6.5a.75.75 0 0 1-.75.75H16a.75.75 0 0 1 0-1.5h1.75a.75.75 0 0 1 .75.75ZM3.25 10a.75.75 0 0 1-.75-.75V8.5a.75.75 0 0 1 1.5 0v.75a.75.75 0 0 1-.75.75Zm11.97-4.72a.75.75 0 0 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.06-1.06ZM4.78 14.22a.75.75 0 0 1 1.06 1.06L4.78 16.34a.75.75 0 0 1-1.06-1.06l1.06-1.06ZM4.78 5.78a.75.75 0 0 1 0 1.06L3.72 7.9a.75.75 0 0 1-1.06-1.06L3.72 4.72a.75.75 0 0 1 1.06 0Zm10.44 8.44a.75.75 0 0 1 0 1.06L14.16 16.34a.75.75 0 0 1-1.06-1.06l1.06-1.06ZM10 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
};
