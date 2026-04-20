import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 32 }) => {
  return (
    <div 
      className={`rounded-lg bg-white flex items-center justify-center transition-transform duration-500 overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 24 24" 
        fill="black" 
        className="w-3/5 h-3/5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
      </svg>
    </div>
  );
};
