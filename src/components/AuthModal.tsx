import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  Check, 
  AlertCircle,
  Loader2,
  Headphones,
  ShieldCheck,
  Disc3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MuzacLogo } from './MuzacLogo';

const AVATAR_OPTIONS = [
  { id: 'av1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', label: 'Vocalist' },
  { id: 'av2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', label: 'Producer' },
  { id: 'av3', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', label: 'DJ' },
  { id: 'av4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', label: 'Audiophile' },
  { id: 'av5', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', label: 'Beatmaker' },
  { id: 'av6', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', label: 'Acoustic' }
];

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register, continueAsGuest } = useAuth();
  
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].url);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide your email/username and password');
      return;
    }

    setIsLoading(true);
    setError(null);
    const res = await login(email.trim(), password);
    setIsLoading(false);

    if (!res.success) {
      setError(res.error || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || !username.trim()) {
      setError('Please complete all required fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError(null);
    const res = await register({
      username: username.trim(),
      email: email.trim(),
      password,
      displayName: displayName.trim() || username.trim(),
      avatar: selectedAvatar
    });
    setIsLoading(false);

    if (!res.success) {
      setError(res.error || 'Failed to create account');
    } else {
      setSuccessMsg('Account created successfully! Welcome to Muzac.');
    }
  };

  const fillDemoCredentials = () => {
    setEmail('listener@muzac.app');
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/80 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md clay-panel-deep rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute right-5 top-5 p-2 rounded-2xl clay-pill text-zinc-400 hover:text-white transition"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center pb-6">
          <MuzacLogo size="lg" glow={true} className="justify-center mb-3" />
          <h2 className="text-2xl font-black text-white tracking-tight m-0">
            {tab === 'login' ? 'Welcome Back to Muzac' : 'Join Muzac Master Hi-Fi'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto m-0">
            {tab === 'login' 
              ? 'Access your cloud playlists, favorites, and 24-bit lossless playback.'
              : 'Sign up to create unlimited playlists and personalize your audio profile.'}
          </p>
        </div>

        {/* Tabs: Login vs Register */}
        <div className="flex p-1 rounded-2xl clay-inset mb-6">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-200">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Forms */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 px-1">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="listener@muzac.app"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-2xl clay-inset text-xs text-white placeholder-zinc-500 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 px-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-2xl clay-inset text-xs text-white placeholder-zinc-500 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-2xl clay-btn-white text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition shadow-lg mt-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-black" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Demo Account Quick-Fill Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs text-zinc-400 hover:text-white transition inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                <span>Fill Demo Account (listener@muzac.app)</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 px-1">
                Choose Profile Avatar
              </label>
              <div className="flex items-center justify-between gap-2 overflow-x-auto py-1 custom-scrollbar">
                {AVATAR_OPTIONS.map(av => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.url)}
                    className={`relative p-0.5 rounded-full transition-all ${
                      selectedAvatar === av.url 
                        ? 'ring-2 ring-white scale-110 shadow-lg' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={av.url}
                      alt={av.label}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    {selectedAvatar === av.url && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1 px-1">
                  Username *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="audiophile99"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl clay-inset text-xs text-white placeholder-zinc-500 outline-none focus:border-white/40 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1 px-1">
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="Sound Wave"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl clay-inset text-xs text-white placeholder-zinc-500 outline-none focus:border-white/40 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1 px-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl clay-inset text-xs text-white placeholder-zinc-500 outline-none focus:border-white/40 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1 px-1">
                Password * (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl clay-inset text-xs text-white placeholder-zinc-500 outline-none focus:border-white/40 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-2xl clay-btn-white text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition shadow-lg mt-3 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Join Muzac Hi-Fi</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer: Guest Mode */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <button
            type="button"
            onClick={continueAsGuest}
            className="hover:text-white transition flex items-center gap-1.5"
          >
            <span>Continue as Guest</span>
          </button>
          <span className="text-[10px] text-zinc-600 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3 text-zinc-500" />
            <span>End-to-End Encrypted</span>
          </span>
        </div>
      </div>
    </div>
  );
};
