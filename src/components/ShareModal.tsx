import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send } from 'lucide-react';
import type { Track } from '../types';

const XIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, track }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !track) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://muzac.vercel.app';
  const shareUrl = `${currentUrl}/?track=${encodeURIComponent(track.id)}`;
  const shareText = `🎶 Listening to "${track.title}" by ${track.artist} on Muzac Hi-Fi Audio: ${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${track.title} - ${track.artist}`,
          text: `Check out "${track.title}" by ${track.artist} on Muzac!`,
          url: shareUrl
        });
        onClose();
      } catch (err) {
        console.log('Native share dismissed:', err);
      }
    } else {
      handleCopy();
    }
  };

  const shareToWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Listening to ${track.title} by ${track.artist} on Muzac`)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-neutral-900/90 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl text-white backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Share Track</h2>
              <p className="text-xs text-neutral-400">Send lossless link to friends</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close share dialog"
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Track Preview Card */}
        <div className="mt-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5">
          <img
            src={track.artwork || '/favicon.svg'}
            alt={`${track.title} by ${track.artist}`}
            loading="lazy"
            decoding="async"
            className="w-14 h-14 rounded-xl object-cover bg-neutral-800 shadow-md"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{track.title}</h4>
            <p className="text-xs text-neutral-400 truncate">{track.artist}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                24-bit Lossless
              </span>
            </div>
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {/* WhatsApp */}
          <button
            onClick={shareToWhatsApp}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 transition-all active:scale-95 group"
          >
            <MessageCircle className="w-5 h-5 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">WhatsApp</span>
          </button>

          {/* Twitter / X */}
          <button
            onClick={shareToTwitter}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 transition-all active:scale-95 group"
          >
            <XIcon className="w-5 h-5 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">X / Twitter</span>
          </button>

          {/* Telegram */}
          <button
            onClick={shareToTelegram}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 transition-all active:scale-95 group"
          >
            <Send className="w-5 h-5 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Telegram</span>
          </button>
        </div>

        {/* Link Copy Box */}
        <div className="mt-5">
          <label className="block text-xs font-medium text-neutral-400 mb-1.5">Share Link</label>
          <div className="flex items-center gap-2 p-1.5 bg-black/50 border border-white/10 rounded-2xl">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-xs text-neutral-300 px-2 flex-1 focus:outline-hidden select-all"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all active:scale-95 flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Native Mobile Share if available */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full mt-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>More Device Options</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
