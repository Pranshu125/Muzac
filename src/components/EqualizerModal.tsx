import React from 'react';
import { X, Sliders, Sparkles, RotateCcw, Volume2, Waves, SlidersHorizontal } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { EQPreset } from '../types';

const FREQUENCIES = [
  '32Hz', '64Hz', '125Hz', '250Hz', '500Hz',
  '1kHz', '2kHz', '4kHz', '8kHz', '16kHz'
];

const PRESETS: EQPreset[] = [
  { name: 'Flat', gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Bass Boost', gains: [7, 6, 4, 2, 0, 0, 0, 0, 1, 1] },
  { name: 'Vocal Booster', gains: [-2, -1, 0, 3, 5, 4, 3, 1, 0, -1] },
  { name: 'Electronic', gains: [5, 4, 2, 0, -1, 2, 3, 4, 5, 5] },
  { name: 'Rock', gains: [4, 3, 2, 0, -1, 0, 2, 3, 4, 4] },
  { name: 'Acoustic', gains: [3, 2, 1, 1, 2, 2, 3, 3, 2, 1] },
  { name: 'Treble Boost', gains: [-2, -2, -1, 0, 1, 2, 4, 6, 7, 8] },
  { name: 'Hip-Hop', gains: [6, 5, 3, 1, 0, 0, 1, 2, 3, 2] },
  { name: 'Deep Chill', gains: [4, 3, 2, 1, 1, 2, 1, 1, 2, 2] }
];

export const EqualizerModal: React.FC = () => {
  const {
    isEQOpen,
    setIsEQOpen,
    eqBands,
    setEqBandGain,
    applyEQPreset,
    spatialAudio,
    setSpatialAudio,
    crossfadeSeconds,
    setCrossfadeSeconds
  } = usePlayer();

  if (!isEQOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/75 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-2xl clay-panel-deep rounded-3xl border border-white/15 p-6 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl clay-pill flex items-center justify-center text-white border border-white/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight m-0">
                10-Band Graphic Equalizer
              </h3>
              <p className="text-xs text-zinc-400 m-0">
                Hi-Res Audio Master DSP &amp; Spatial Tuning
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEQOpen(false)}
            className="p-2 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spatial Audio & Reset row */}
        <div className="flex items-center justify-between py-4">
          <button
            onClick={() => setSpatialAudio(!spatialAudio)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              spatialAudio
                ? 'clay-btn-white'
                : 'clay-pill text-zinc-400 hover:text-white'
            }`}
          >
            <Waves className="w-4 h-4" />
            <span>Spatial 3D Audio: {spatialAudio ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => applyEQPreset([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl clay-pill text-xs font-bold text-zinc-300 hover:text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Flat</span>
          </button>
        </div>

        {/* Presets Chips */}
        <div className="flex flex-wrap gap-2 pb-5 border-b border-white/10">
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyEQPreset(preset.gains)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold clay-pill text-zinc-300 hover:text-white transition"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* 10 Vertical Sliders */}
        <div className="pt-6 pb-2">
          <div className="flex items-end justify-between gap-2 h-52 px-2">
            {FREQUENCIES.map((freq, idx) => {
              const gain = eqBands[idx] ?? 0;
              return (
                <div key={freq} className="flex-1 flex flex-col items-center gap-2 h-full">
                  <span className="text-[10px] font-mono font-bold text-zinc-400">
                    {gain > 0 ? `+${gain}` : gain}dB
                  </span>

                  <div className="flex-1 flex items-center justify-center relative py-2">
                    <input
                      type="range"
                      min={-12}
                      max={12}
                      step={1}
                      value={gain}
                      onChange={e => setEqBandGain(idx, parseFloat(e.target.value))}
                      className="accent-white w-36 -rotate-90 origin-center cursor-pointer"
                    />
                  </div>

                  <span className="text-[11px] font-bold text-zinc-300 mt-2">
                    {freq}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Crossfade & Visualizer simulation */}
        <div className="mt-4 p-4 rounded-2xl clay-card border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
            <Sparkles className="w-4 h-4 text-white" />
            <span>Real-time ALAC 64-bit Floating Point DSP Active</span>
          </div>
          <div className="flex items-center gap-1 h-3">
            {[40, 75, 90, 60, 80, 50, 95, 65, 45, 85].map((h, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-white animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDuration: `${0.4 + (i % 5) * 0.15}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
