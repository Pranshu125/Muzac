import React from 'react';
import { 
  X, 
  Laptop2, 
  Speaker, 
  Headphones, 
  Tv, 
  Radio, 
  Check, 
  Cast,
  Volume2
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import type { AudioOutputDevice } from '../types';

export const DevicePickerModal: React.FC = () => {
  const {
    isDevicePickerOpen,
    setIsDevicePickerOpen,
    activeDevice,
    setActiveDevice
  } = usePlayer();

  if (!isDevicePickerOpen) return null;

  const devices: AudioOutputDevice[] = [
    {
      id: 'computer',
      name: 'This Computer (Built-in Speakers)',
      type: 'computer',
      isActive: activeDevice === 'computer',
      quality: '24-bit / 192 kHz ALAC Master'
    },
    {
      id: 'airplay-monitors',
      name: 'Living Room Studio Monitors (AirPlay 2)',
      type: 'airplay',
      isActive: activeDevice === 'airplay-monitors',
      quality: 'AirPlay Hi-Res Lossless'
    },
    {
      id: 'headphones',
      name: 'Sony WH-1000XM5 (Bluetooth Hi-Res)',
      type: 'bluetooth',
      isActive: activeDevice === 'headphones',
      quality: 'LDAC 990 kbps / Spatial Audio'
    },
    {
      id: 'apple-tv',
      name: 'Apple TV 4K (Home Theater)',
      type: 'cast',
      isActive: activeDevice === 'apple-tv',
      quality: 'Dolby Atmos Multi-Channel'
    },
    {
      id: 'homepod',
      name: 'Studio Reference Subwoofer & Mon',
      type: 'speaker',
      isActive: activeDevice === 'homepod',
      quality: 'Bit-Perfect Direct Out'
    }
  ];

  const getDeviceIcon = (type: AudioOutputDevice['type']) => {
    switch (type) {
      case 'computer':
        return <Laptop2 className="w-5 h-5" />;
      case 'airplay':
        return <Radio className="w-5 h-5" />;
      case 'bluetooth':
        return <Headphones className="w-5 h-5" />;
      case 'cast':
        return <Tv className="w-5 h-5" />;
      default:
        return <Speaker className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/75 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md clay-panel-deep rounded-3xl border border-white/15 p-6 shadow-2xl relative text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl clay-pill flex items-center justify-center text-white border border-white/20">
              <Cast className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white m-0">
                Connect to a Device
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 m-0">
                Spotify Connect &amp; Apple AirPlay
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDevicePickerOpen(false)}
            className="p-2 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device List */}
        <div className="py-4 space-y-2">
          {devices.map(device => {
            const isCurrent = device.isActive;
            return (
              <div
                key={device.id}
                onClick={() => setActiveDevice(device.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-white text-black shadow-lg font-bold'
                    : 'clay-card text-zinc-300 hover:text-white hover:border-white/25'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2 rounded-xl ${isCurrent ? 'bg-black text-white' : 'clay-pill text-zinc-400'}`}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold m-0 leading-tight">
                      {device.name}
                    </h4>
                    <p className={`text-[10px] mt-0.5 m-0 ${isCurrent ? 'text-zinc-700' : 'text-zinc-500'}`}>
                      {device.quality}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isCurrent && (
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-white" />
            <span>Lossless stream routed automatically</span>
          </div>
          <button
            onClick={() => setIsDevicePickerOpen(false)}
            className="px-4 py-1.5 rounded-2xl clay-btn-white text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
