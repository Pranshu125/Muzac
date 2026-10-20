import React from 'react';

interface MuzacLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  showText?: boolean;
  className?: string;
  glow?: boolean;
}

export const MuzacLogo: React.FC<MuzacLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  glow = true
}) => {
  const pixelSize = typeof size === 'number' 
    ? size 
    : size === 'xs' ? 24 
    : size === 'sm' ? 32 
    : size === 'md' ? 40 
    : size === 'lg' ? 48 
    : 64;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Minimalist Iconic Soundwave "M" Emblem */}
      <div 
        className="relative flex-shrink-0 flex items-center justify-center rounded-2xl p-0.5"
        style={{
          width: `${pixelSize}px`,
          height: `${pixelSize}px`
        }}
      >
        {glow && (
          <div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/30 via-indigo-500/20 to-cyan-500/30 blur-md pointer-events-none"
          />
        )}
        
        <svg 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-md"
        >
          <defs>
            {/* Background Liquid Glass Tile */}
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#181a28" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#10121d" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0a0b12" stopOpacity="0.98" />
            </linearGradient>

            {/* Specular Refraction Edge */}
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="35%" stopColor="#a78bfa" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>

            {/* Soundwave "M" Vibrant Prismatic Fill */}
            <linearGradient id="mGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#c4b5fd" />
              <stop offset="70%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* Inner Glow */}
            <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Squircle Tile */}
          <rect 
            x="2" 
            y="2" 
            width="60" 
            height="60" 
            rx="18" 
            fill="url(#bgGrad)" 
            stroke="url(#edgeGrad)" 
            strokeWidth="1.5" 
          />

          {/* Minimalist Geometric Soundwave "M" */}
          {/* Constructed as continuous fluid audio frequency curves */}
          <g filter="url(#waveGlow)">
            {/* Left Stave */}
            <rect x="14" y="20" width="4.5" height="24" rx="2.25" fill="url(#mGrad)" opacity="0.85" />
            
            {/* Left Crest Pill */}
            <rect x="23" y="14" width="4.5" height="36" rx="2.25" fill="url(#mGrad)" />
            
            {/* Center Resonant Frequency Node */}
            <rect x="32" y="24" width="4.5" height="22" rx="2.25" fill="url(#mGrad)" opacity="0.9" />
            
            {/* Right Crest Pill */}
            <rect x="41" y="14" width="4.5" height="36" rx="2.25" fill="url(#mGrad)" />
            
            {/* Right Stave */}
            <rect x="50" y="20" width="4.5" height="24" rx="2.25" fill="url(#mGrad)" opacity="0.85" />

            {/* Center Dynamic Audio Pulse Dot */}
            <circle cx="34.25" cy="17" r="2.25" fill="#38bdf8" />
          </g>
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-white tracking-wider leading-none font-sans">
              MUZAC
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
          </div>
          <span className="text-[9px] uppercase tracking-widest font-black text-violet-300/80 mt-1">
            Hi-Fi Audio Engine
          </span>
        </div>
      )}
    </div>
  );
};
