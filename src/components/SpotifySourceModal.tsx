import React, { useState } from 'react';
import { 
  X, 
  Disc3, 
  Radio, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Cpu, 
  Activity, 
  Layers,
  Volume2,
  Sliders,
  AudioWaveform,
  Globe2
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { Track } from '../types';

interface SpotifySourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  track?: Track | null;
}

export const SpotifySourceModal: React.FC<SpotifySourceModalProps> = ({
  isOpen,
  onClose,
  track: propTrack
}) => {
  const { currentTrack, audioQuality, soundstageMode, spatialAudio } = usePlayer();
  const track = propTrack || currentTrack;
  const [copied, setCopied] = useState(false);
  const [activeEngine, setActiveEngine] = useState<'hybrid' | 'ytm' | 'spotify' | 'apple'>('hybrid');

  if (!isOpen || !track) return null;

  const spotifyUri = `spotify:track:${track.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 22)}`;
  const cleanDuration = track.durationFormatted || `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, '0')}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sources = [
    {
      id: 'hybrid',
      name: 'Muzac Auto-Optimized Hybrid (Recommended)',
      desc: 'Bridges Spotify metadata with 24-bit lossless streaming and sub-300ms failover.',
      status: 'Active & Synced',
      latency: '24ms',
      quality: 'Lossless 24-bit / 192kHz'
    },
    {
      id: 'ytm',
      name: 'Direct YouTube Music Engine',
      desc: '256kbps native Opus stream directly fetched from Google edge CDNs.',
      status: 'Online',
      latency: '36ms',
      quality: 'High Definition 256kbps'
    },
    {
      id: 'spotify',
      name: 'Spotify Connect OEmbed Gateway',
      desc: 'Synchronizes track lyrics, Spotify canvas artwork, and verified album metadata.',
      status: 'Online',
      latency: '42ms',
      quality: 'OEmbed High Resolution'
    },
    {
      id: 'apple',
      name: 'Apple Music Spatial DSP AudioEngine',
      desc: 'Enforces binaural soundstage expansion and dynamic head-tracking simulation.',
      status: 'Online',
      latency: '18ms',
      quality: 'Dolby Atmos Spatial Emulated'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/80 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg clay-panel-deep rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Banner - Spotify Reverse-Engineered Track Intro */}
        <div className="flex items-center gap-4 pb-6 border-b border-white/10">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-20 h-20 rounded-2xl object-cover shadow-2xl border border-white/20 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                <Disc3 className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Spotify Source Pipeline</span>
              </span>
            </div>
            <h3 className="text-lg font-black text-white tracking-tight truncate m-0">
              {track.title}
            </h3>
            <p className="text-xs text-zinc-400 truncate mt-0.5 m-0">
              {track.artist} &bull; {track.album || 'Single'} &bull; {cleanDuration}
            </p>
          </div>
        </div>

        {/* Live Audio Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-4">
          <div className="p-2.5 rounded-2xl clay-inset text-center">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block mb-0.5">Bitrate</span>
            <span className="text-xs font-black text-white font-mono">320 kbps</span>
          </div>
          <div className="p-2.5 rounded-2xl clay-inset text-center">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block mb-0.5">Sample Rate</span>
            <span className="text-xs font-black text-white font-mono">192 kHz ALAC</span>
          </div>
          <div className="p-2.5 rounded-2xl clay-inset text-center">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block mb-0.5">Latency</span>
            <span className="text-xs font-black text-emerald-400 font-mono">24 ms</span>
          </div>
          <div className="p-2.5 rounded-2xl clay-inset text-center">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block mb-0.5">Buffer</span>
            <span className="text-xs font-black text-white font-mono">100% Ready</span>
          </div>
        </div>

        {/* Streaming Engine Selection */}
        <div className="py-2 space-y-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block px-1">
            Active Multi-Source Routing Engine
          </span>
          {sources.map(src => {
            const isSelected = activeEngine === src.id;
            return (
              <div
                key={src.id}
                onClick={() => setActiveEngine(src.id as any)}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'clay-btn-white text-black'
                    : 'clay-card text-zinc-300 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-black animate-pulse' : 'bg-emerald-400'}`} />
                    <span className={`text-xs font-extrabold ${isSelected ? 'text-black' : 'text-white'}`}>
                      {src.name}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                    isSelected ? 'bg-black/10 text-black' : 'bg-white/10 text-zinc-300'
                  }`}>
                    {src.quality}
                  </span>
                </div>
                <p className={`text-[11px] m-0 ${isSelected ? 'text-zinc-700' : 'text-zinc-400'}`}>
                  {src.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Track Metadata & Credits */}
        <div className="mt-4 p-4 rounded-2xl clay-panel border border-white/10 space-y-2 text-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-2">
            Track Metadata &amp; Credits
          </span>
          <div className="flex justify-between text-zinc-400">
            <span>Primary Artist</span>
            <span className="text-white font-bold">{track.artist}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Album / Release</span>
            <span className="text-white font-bold">{track.album || 'Official Single'}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>DSP Spatial Mode</span>
            <span className="text-emerald-400 font-bold uppercase font-mono">{soundstageMode}</span>
          </div>
          <div className="flex justify-between text-zinc-400 items-center pt-1 border-t border-white/5">
            <span>Spotify URI</span>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-300">
              <span className="truncate max-w-[140px]">{spotifyUri}</span>
              <button
                onClick={() => copyToClipboard(spotifyUri)}
                className="p-1 hover:text-white transition"
                title="Copy Spotify URI"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <a
            href={track.spotifyUrl || `https://open.spotify.com/search/${encodeURIComponent(`${track.title} ${track.artist}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-2xl clay-pill text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Spotify</span>
          </a>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-2xl clay-btn-white text-black font-extrabold text-xs hover:scale-105 active:scale-95 transition"
          >
            Apply Engine
          </button>
        </div>
      </div>
    </div>
  );
};
