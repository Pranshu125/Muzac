import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Muzac Uncaught React Exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  private handleClearCacheAndReload = async () => {
    try {
      // Clear localStorage cache
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('muzac_') || key.startsWith('swr_') || key.startsWith('cache_'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));

      // Unregister service workers and purge caches
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }

      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const name of cacheNames) {
          await caches.delete(name);
        }
      }
    } catch (e) {
      console.warn('Cache clearing notice:', e);
    } finally {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07080c] text-white flex items-center justify-center p-6 select-none font-sans">
          {/* Ambient glow backdrop */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-neutral-600/10 rounded-full blur-2xl" />
          </div>

          <div className="relative max-w-lg w-full bg-neutral-900/80 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl shadow-black/80 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Playback Restored
            </h1>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              Muzac encountered a client-side layout exception. Your library, playlists, and settings are preserved. Click below to reload cleanly.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 bg-black/40 border border-white/5 rounded-xl text-left font-mono text-xs text-neutral-400 overflow-x-auto max-h-28 custom-scrollbar">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all active:scale-95 shadow-lg shadow-white/10"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Player
              </button>
              <button
                onClick={this.handleClearCacheAndReload}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 border border-white/10 text-neutral-200 font-medium text-sm transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cache & Refresh
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
