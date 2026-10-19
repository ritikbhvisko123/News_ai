import React, { useState, useRef, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplets, MapPin, X } from 'lucide-react';
import { IndoreWeather } from '../types/news.ts';

interface WeatherWidgetProps {
  weather?: IndoreWeather;
  language: 'hi' | 'en';
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!weather) return null;

  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('rain') || c.includes('फुहार')) return <CloudRain className="w-4 h-4 text-blue-400" />;
    if (c.includes('cloud') || c.includes('बादल') || c.includes('fog') || c.includes('धुंध'))
      return <Cloud className="w-4 h-4 text-sky-400" />;
    return <Sun className="w-4 h-4 text-amber-500" />;
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200/80 dark:bg-gray-800 dark:hover:bg-gray-700/80 text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors"
        title={language === 'hi' ? 'इंदौर का मौसम विवरण' : 'Indore Live Weather'}
      >
        <MapPin className="w-3.5 h-3.5 text-red-500" />
        <span className="font-semibold">{language === 'hi' ? 'इंदौर' : 'Indore'}</span>
        {getWeatherIcon(weather.condition)}
        <span className="font-bold">{weather.temperature}°C</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-64 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 p-4 text-gray-900 dark:text-white animate-scale-up">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="font-bold text-sm">
                {language === 'hi' ? 'इंदौर का लाइव मौसम' : 'Indore Live Weather'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40">
                {getWeatherIcon(weather.condition)}
              </div>
              <div>
                <div className="text-2xl font-extrabold">{weather.temperature}°C</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'hi' ? weather.conditionHindi : weather.condition}
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-gray-500 dark:text-gray-400">
              <div>↑ {weather.high}°C</div>
              <div>↓ {weather.low}°C</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-gray-50 dark:bg-gray-800/60 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <span>{language === 'hi' ? 'नमी:' : 'Humidity:'} {weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
              <Wind className="w-3.5 h-3.5 text-teal-500" />
              <span>{weather.windSpeed} km/h</span>
            </div>
          </div>

          {weather.aqiEstimate && (
            <div className="mt-2.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 text-center">
              🌿 {language === 'hi' ? 'वायु गुणवत्ता: 68 (संतोषजनक)' : weather.aqiEstimate}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
