import React from 'react';

interface LiquidBackgroundProps {
  primaryColor?: string;
  secondaryColor?: string;
  isPlaying?: boolean;
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({
  primaryColor = 'rgba(139, 92, 246, 0.22)',
  secondaryColor = 'rgba(6, 182, 212, 0.16)',
  isPlaying = false,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#06070f]">
      {/* Dynamic Animated Sonic Orbs (Electric Violet / Cyan Iris) */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] rounded-full filter blur-[140px] opacity-40 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
          animation: isPlaying ? 'floatOrb 18s infinite alternate ease-in-out' : 'none',
        }}
      />
      
      <div
        className="absolute top-[25%] -right-[15%] w-[60vw] h-[60vw] rounded-full filter blur-[150px] opacity-35 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)`,
          animation: isPlaying ? 'floatOrb 24s infinite alternate-reverse ease-in-out' : 'none',
        }}
      />

      <div
        className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[70vw] rounded-full filter blur-[160px] opacity-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${primaryColor} 0%, ${secondaryColor} 50%, transparent 80%)`,
          animation: isPlaying ? 'floatOrb 30s infinite alternate ease-in-out' : 'none',
        }}
      />

      {/* Subtle Specular Shimmer */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#080914]/50 to-[#04050a]/90 backdrop-blur-[45px]" />
      
      {/* Frosted starlight noise grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
