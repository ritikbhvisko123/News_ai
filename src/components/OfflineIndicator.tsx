import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus.ts';

export const OfflineIndicator: React.FC<{ language: 'hi' | 'en' }> = ({ language }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-full bg-amber-600/95 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white shadow-xl border border-amber-400/40 animate-fade-in">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>
        {language === 'hi'
          ? 'ऑफ़लाइन मोड — सुरक्षित कैश से समाचार लोड किए गए हैं'
          : 'Offline Mode — Showing locally cached news'}
      </span>
    </div>
  );
};
