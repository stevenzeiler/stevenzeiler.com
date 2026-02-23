'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DISMISS_KEY = 'health-app-add-to-home-dismissed';

function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export default function AddToHomeScreenHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) return;
    if (isIOS() && !isStandalone()) {
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-4 left-4 right-4 z-[100] sm:left-auto sm:right-4 sm:max-w-sm"
        >
          <div className="bg-forest-900/95 backdrop-blur-md border border-leaf-500/50 rounded-2xl p-4 shadow-lg shadow-black/20">
            <div className="flex items-start gap-3">
              <motion.div
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-leaf-500/20 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-leaf-400">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13 2v4M11 2v4M15 2v4" />
                </svg>
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-earth-100 font-medium text-sm">Install Health app</p>
                <p className="text-earth-400 text-xs mt-0.5">
                  Tap <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-forest-800 text-earth-200 font-medium">Share</span> then <span className="font-medium text-leaf-400">Add to Home Screen</span> for a native feel.
                </p>
              </div>
              <button
                type="button"
                onClick={dismiss}
                className="flex-shrink-0 p-1 rounded-lg text-earth-500 hover:text-earth-300 hover:bg-forest-800 transition-colors"
                aria-label="Dismiss"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
