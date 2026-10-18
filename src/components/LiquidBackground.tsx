import React from 'react';

interface LiquidBackgroundProps {
  primaryColor?: string;
  secondaryColor?: string;
  isPlaying?: boolean;
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({
  primaryColor = 'rgba(255, 255, 255, 0.08)',
  secondaryColor = 'rgba(160, 160, 175, 0.04)',
  isPlaying = false,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#07080c]">
      {/* Dynamic Animated Monochrome Orbs */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] rounded-full filter blur-[130px] opacity-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
          animation: isPlaying ? 'floatOrb 18s infinite alternate ease-in-out' : 'none',
        }}
      />
      
      <div
        className="absolute top-[30%] -right-[15%] w-[60vw] h-[60vw] rounded-full filter blur-[150px] opacity-25 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)`,
          animation: isPlaying ? 'floatOrb 24s infinite alternate-reverse ease-in-out' : 'none',
        }}
      />

      <div
        className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[70vw] rounded-full filter blur-[160px] opacity-20 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${primaryColor} 0%, ${secondaryColor} 50%, transparent 80%)`,
          animation: isPlaying ? 'floatOrb 30s infinite alternate ease-in-out' : 'none',
        }}
      />

      {/* Subtle Specular Shimmer */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#080910]/60 to-[#050608]/90 backdrop-blur-[45px]" />
      
      {/* Frosted monochrome noise grid */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
