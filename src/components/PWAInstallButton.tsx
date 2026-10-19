import React, { useState } from 'react';
import { Download, Share, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';

export const PWAInstallButton: React.FC<{ language: 'hi' | 'en' }> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  // Android / Chrome / Desktop PWA install
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors active:scale-95"
        title={language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install PWA App'}
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-2.5 py-1.5 text-xs font-medium transition-colors"
          title={language === 'hi' ? 'आईफोन पर इंस्टॉल करें' : 'Install on iPhone'}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{language === 'hi' ? 'आईफोन ऐप' : 'iOS App'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white animate-scale-up">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-base">
                  {language === 'hi' ? 'आईफोन / आईपैड पर इंस्टॉल करें' : 'Install on iPhone / iPad'}
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-full p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <p>
                    {language === 'hi'
                      ? 'सफारी ब्राउज़र में नीचे शेयर (Share)'
                      : 'Tap the '}{' '}
                    <Share className="w-4 h-4 inline text-blue-500" />{' '}
                    {language === 'hi' ? 'बटन दबाएं।' : 'Share icon in Safari.'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <p>
                    {language === 'hi'
                      ? 'नीचे स्क्रॉल करें और "Add to Home Screen" चुनें।'
                      : 'Scroll down and tap "Add to Home Screen".'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p>
                    {language === 'hi'
                      ? 'ऐप आपके होम स्क्रीन पर सीधे एक नेटिव ऐप की तरह काम करेगा।'
                      : 'The app is now accessible directly from your home screen!'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-red-600 hover:bg-red-700 text-white py-2.5 text-sm font-semibold transition-colors"
              >
                {language === 'hi' ? 'समझ गए' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
