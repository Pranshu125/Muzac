import React, { useRef, useState } from 'react';
import { X, Download, Upload, Database, Check, AlertCircle } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { likedTracks, customPlaylists, eqBands } = usePlayer();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleExportBackup = () => {
    try {
      const backupData = {
        version: '2.0.0',
        exportedAt: new Date().toISOString(),
        likedTracks,
        customPlaylists,
        eqBands,
        settings: {
          audioQuality: localStorage.getItem('muzac_audio_quality') || 'high',
          playbackSpeed: localStorage.getItem('muzac_playback_speed') || '1',
          volume: localStorage.getItem('muzac_volume') || '0.8',
        }
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `muzac-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage({ text: 'Backup downloaded successfully!', type: 'success' });
    } catch {
      setStatusMessage({ text: 'Failed to create backup file.', type: 'error' });
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = JSON.parse(raw);

        if (!parsed.likedTracks && !parsed.customPlaylists) {
          setStatusMessage({ text: 'Invalid backup file structure.', type: 'error' });
          return;
        }

        if (Array.isArray(parsed.likedTracks)) {
          localStorage.setItem('muzac_liked_tracks', JSON.stringify(parsed.likedTracks));
        }

        if (Array.isArray(parsed.customPlaylists)) {
          localStorage.setItem('muzac_playlists', JSON.stringify(parsed.customPlaylists));
        }

        if (Array.isArray(parsed.eqBands)) {
          localStorage.setItem('muzac_eq_bands', JSON.stringify(parsed.eqBands));
        }

        setStatusMessage({ text: 'Library restored! Reloading...', type: 'success' });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch {
        setStatusMessage({ text: 'Failed to parse JSON backup file.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-neutral-900/95 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl text-white backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Library Backup &amp; Restore</h2>
              <p className="text-xs text-neutral-400">Save and sync your music data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close backup dialog"
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Stats */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-white">{likedTracks.length}</div>
            <div className="text-xs text-neutral-400 font-medium">Favorite Songs</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-white">{customPlaylists.length}</div>
            <div className="text-xs text-neutral-400 font-medium">Custom Playlists</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-3">
          <button
            onClick={handleExportBackup}
            className="w-full flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all active:scale-95 shadow-lg shadow-white/10"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (.json)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-sm transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Restore From File</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>

        {statusMessage && (
          <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
            statusMessage.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {statusMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupModal;
