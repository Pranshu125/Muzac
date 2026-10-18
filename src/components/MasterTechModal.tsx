import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Waves, 
  Cpu, 
  SlidersHorizontal, 
  Volume2, 
  Sparkles,
  Info,
  CheckCircle2,
  Gauge
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { SoundstageMode } from '../types';

export const MasterTechModal: React.FC = () => {
  const {
    isMasterTechOpen,
    setIsMasterTechOpen,
    audioQuality,
    setAudioQuality,
    spatialAudio,
    setSpatialAudio,
    soundstageMode,
    setSoundstageMode,
    soundCheckEnabled,
    setSoundCheckEnabled,
    crossfadeSeconds,
    setCrossfadeSeconds
  } = usePlayer();

  if (!isMasterTechOpen) return null;

  const soundstages: { id: SoundstageMode; label: string; desc: string }[] = [
    { id: 'mono', label: 'Mono', desc: 'Single centered channel' },
    { id: 'balanced', label: 'Balanced', desc: 'Standard studio stereo separation' },
    { id: 'wide', label: 'Wide Stereo', desc: 'Expanded acoustic field' },
    { id: 'cinema3d', label: 'Cinema 3D', desc: 'Immersive Dolby Atmos multi-point field' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/75 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-xl clay-panel-deep rounded-3xl border border-white/15 p-6 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl clay-pill flex items-center justify-center text-white border border-white/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white m-0">
                  Apple Master Hi-Res Audio
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-white text-black text-[10px] font-black uppercase">
                  ALAC Lossless
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 m-0">
                24-bit / 192 kHz Bit-Perfect Master Audio Engine
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMasterTechOpen(false)}
            className="p-2 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technical Specs Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5">
          <div className="clay-card p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Codec</span>
            <span className="text-sm font-extrabold text-white mt-1 block">ALAC / FLAC</span>
            <span className="text-[10px] text-zinc-500">Lossless</span>
          </div>

          <div className="clay-card p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Resolution</span>
            <span className="text-sm font-extrabold text-white mt-1 block">24-Bit Depth</span>
            <span className="text-[10px] text-zinc-500">192,000 Hz</span>
          </div>

          <div className="clay-card p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Bitrate</span>
            <span className="text-sm font-extrabold text-white mt-1 block">9,216 kbps</span>
            <span className="text-[10px] text-zinc-500">Uncompressed</span>
          </div>

          <div className="clay-card p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Dynamic Range</span>
            <span className="text-sm font-extrabold text-white mt-1 block">114 dB</span>
            <span className="text-[10px] text-zinc-500">Pro Studio</span>
          </div>
        </div>

        {/* Spatial Audio Soundstage Selector */}
        <div className="py-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Spatial Audio Soundstage
              </span>
            </div>
            <button
              onClick={() => setSpatialAudio(!spatialAudio)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                spatialAudio ? 'clay-btn-white' : 'clay-pill text-zinc-400'
              }`}
            >
              {spatialAudio ? 'Spatial Enabled' : 'Spatial Off'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {soundstages.map(stage => (
              <button
                key={stage.id}
                onClick={() => setSoundstageMode(stage.id)}
                className={`p-2.5 rounded-2xl text-left transition-all ${
                  soundstageMode === stage.id
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'clay-card text-zinc-300 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{stage.label}</div>
                <div className={`text-[10px] mt-0.5 ${soundstageMode === stage.id ? 'text-zinc-700' : 'text-zinc-500'}`}>
                  {stage.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Spotify Crossfade & Apple Sound Check */}
        <div className="py-4 border-t border-white/10 space-y-4">
          {/* Crossfade */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                <span>Spotify Seamless Crossfade</span>
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {crossfadeSeconds === 0 ? 'Off (Gapless)' : `${crossfadeSeconds}s`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              step={1}
              value={crossfadeSeconds}
              onChange={e => setCrossfadeSeconds(parseInt(e.target.value, 10))}
              className="w-full cursor-pointer"
            />
          </div>

          {/* Sound Check Normalization */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-xs font-bold text-white block">
                Sound Check (Auto-Volume Normalization)
              </span>
              <span className="text-[11px] text-zinc-400">
                Maintains consistent -14 LUFS loudness across songs
              </span>
            </div>
            <button
              onClick={() => setSoundCheckEnabled(!soundCheckEnabled)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                soundCheckEnabled ? 'clay-btn-white' : 'clay-pill text-zinc-400'
              }`}
            >
              {soundCheckEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>Hardware DAC Output Match Active</span>
          </div>
          <button
            onClick={() => setIsMasterTechOpen(false)}
            className="px-4 py-2 rounded-2xl clay-pill text-xs font-bold text-white hover:bg-white/10 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
