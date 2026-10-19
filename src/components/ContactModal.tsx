import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, Music, Bug, Sparkles, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState<'request' | 'bug' | 'feature' | 'general'>('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage('Please enter your message or request.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          name: name.trim() || 'Anonymous Listener',
          email: email.trim(),
          subject: subject.trim() || `${category.toUpperCase()} Submission`,
          message: message.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubmitted(true);
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setErrorMessage(data.error || 'Submission failed. Please try again.');
      }
    } catch {
      // Offline fallback: save feedback to localStorage
      try {
        const offlineQueue = JSON.parse(localStorage.getItem('muzac_offline_feedback') || '[]');
        offlineQueue.push({ category, name, email, subject, message, date: new Date().toISOString() });
        localStorage.setItem('muzac_offline_feedback', JSON.stringify(offlineQueue));
        setIsSubmitted(true);
      } catch {
        setErrorMessage('Network connection lost. Please check your internet.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setMessage('');
    setSubject('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-neutral-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-white backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Contact &amp; Feedback</h2>
              <p className="text-xs text-neutral-400">Request songs, report glitches, or share ideas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close contact dialog"
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Feedback Received!</h3>
            <p className="text-sm text-neutral-400 max-w-sm mb-6 leading-relaxed">
              Thank you for contributing to Muzac. Your request has been queued directly for the development team.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all active:scale-95 shadow-lg"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Category Selectors */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setCategory('general')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium transition-all ${
                    category === 'general'
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mb-1" />
                  General
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('request')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium transition-all ${
                    category === 'request'
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  <Music className="w-4 h-4 mb-1" />
                  Song Request
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('bug')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium transition-all ${
                    category === 'bug'
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  <Bug className="w-4 h-4 mb-1" />
                  Bug Report
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('feature')}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-medium transition-all ${
                    category === 'feature'
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mb-1" />
                  Feature
                </button>
              </div>
            </div>

            {/* Optional name & email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Your Name / Handle (Optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anonymous Listener"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Email for reply (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="listener@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={category === 'request' ? 'e.g. Add Arijit Singh Acoustic Unplugged' : 'Brief title...'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-white/30 transition-colors"
              />
            </div>

            {/* Message Area */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Message / Details *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your suggestion, track request, or glitch details..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-white/30 transition-colors resize-none custom-scrollbar"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-red-400 font-medium">{errorMessage}</p>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Mail className="w-3.5 h-3.5" />
                <span>Support: support@muzac.app</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-white/10"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
