import React, { useState } from 'react';
import { Calendar, CloudSun, Moon, Sun, Wind, Sparkles, RefreshCw, Compass } from 'lucide-react';
import { DAYS_OF_WEEK, GloranthanSeason, LUNAR_PHASES, SEASONS, WEEKS_NAMES, generateRandomWeather } from '../data/calendar';
import { RuneBadge } from './RuneBadge';

export const CalendarView: React.FC = () => {
  const [year, setYear] = useState(1625);
  const [selectedSeason, setSelectedSeason] = useState<GloranthanSeason>(SEASONS[0]);
  const [selectedWeekIdx, setSelectedWeekIdx] = useState<number>(0);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(3); // Windsday (Jour des Vents)
  const [selectedLunarPhase, setSelectedLunarPhase] = useState(LUNAR_PHASES[2]); // Pleine Lune Rousse
  const [weatherState, setWeatherState] = useState(generateRandomWeather('sea'));

  const handleRollWeather = () => {
    setWeatherState(generateRandomWeather(selectedSeason.id));
  };

  const currentDay = DAYS_OF_WEEK[selectedDayIdx];
  const currentWeek = WEEKS_NAMES[selectedWeekIdx];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 text-stone-100 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-amber-800/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-900/30 border border-amber-600/50 text-amber-400">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-amber-200">
                Calendrier & Éphéméride de Glorantha
              </h1>
              <p className="text-xs text-stone-400">
                Suivi des 5 Saisons et de la Saison Sacrée, des jours sacrés des cultes et des phases de la Lune Rousse.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-serif text-stone-400">Année :</span>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-24 bg-stone-950 border border-amber-600/40 rounded-lg px-2.5 py-1.5 text-center font-mono font-bold text-amber-300 text-sm"
            />
            <span className="text-xs text-stone-500 font-serif">S.T. (Temps de Sartar)</span>
          </div>
        </div>

        {/* Current Date Display Pill */}
        <div className="p-4 rounded-xl bg-stone-950/80 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <div className="text-xs text-stone-400">Date Actuelle Sélectionnée :</div>
            <div className="text-lg font-serif font-bold text-amber-300">
              {currentDay.name} ({currentDay.englishName}) • {currentWeek.name} • {selectedSeason.name} {year}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <RuneBadge rune={selectedSeason.rune} />
            <RuneBadge rune={currentWeek.rune} />
          </div>
        </div>
      </div>

      {/* Main Grid: Season, Week, Day & Moon Selectors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Season & Calendar Matrix */}
        <div className="lg:col-span-8 space-y-6">
          {/* Seasons Selection */}
          <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
            <h2 className="font-serif font-bold text-sm text-amber-200">
              1. Choix de la Saison
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SEASONS.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedSeason(s);
                    setWeatherState(generateRandomWeather(s.id));
                  }}
                  className={`p-3 rounded-xl border transition cursor-pointer space-y-1 ${
                    selectedSeason.id === s.id
                      ? 'bg-amber-950/50 border-amber-500 shadow-md text-amber-100'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-stone-200">{s.name}</span>
                    <RuneBadge rune={s.rune} size="sm" showLabel={false} />
                  </div>
                  <p className="text-[10px] text-stone-500 line-clamp-2">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weeks Selection */}
          <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
            <h2 className="font-serif font-bold text-sm text-amber-200">
              2. Semaine Sacrée ({selectedSeason.weeksCount} semaines)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WEEKS_NAMES.slice(0, selectedSeason.weeksCount).map((w, idx) => (
                <button
                  key={w.name}
                  onClick={() => setSelectedWeekIdx(idx)}
                  className={`p-2.5 rounded-lg border text-xs font-serif font-semibold transition cursor-pointer flex items-center justify-between ${
                    selectedWeekIdx === idx
                      ? 'bg-amber-600/30 text-amber-300 border-amber-500'
                      : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  <span>{w.name}</span>
                  <RuneBadge rune={w.rune} size="sm" showLabel={false} />
                </button>
              ))}
            </div>
          </div>

          {/* Days Selection */}
          <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
            <h2 className="font-serif font-bold text-sm text-amber-200">
              3. Jours de la Semaine
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {DAYS_OF_WEEK.map((d, dIdx) => (
                <div
                  key={d.name}
                  onClick={() => setSelectedDayIdx(dIdx)}
                  className={`p-3 rounded-xl border text-xs transition cursor-pointer space-y-1 ${
                    selectedDayIdx === dIdx
                      ? 'bg-amber-950/40 border-amber-500 text-amber-100 shadow'
                      : 'bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="font-serif font-bold text-stone-200 flex items-center justify-between">
                    <span>{d.name}</span>
                    <span className="text-[10px] text-stone-500 font-mono">({d.englishName})</span>
                  </div>
                  <p className="text-[11px] text-stone-400">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Weather, Omens & Red Moon Phase */}
        <div className="lg:col-span-4 space-y-6">
          {/* Lunar Phase Widget */}
          <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3">
            <h3 className="font-serif font-bold text-sm text-rose-300 flex items-center gap-2">
              <Moon className="h-4 w-4 text-rose-400" /> Phases de la Lune Rouge
            </h3>
            <div className="space-y-2">
              {LUNAR_PHASES.map((lp) => (
                <div
                  key={lp.name}
                  onClick={() => setSelectedLunarPhase(lp)}
                  className={`p-2.5 rounded-lg border text-xs transition cursor-pointer space-y-1 ${
                    selectedLunarPhase.name === lp.name
                      ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{lp.name}</span>
                    {selectedLunarPhase.name === lp.name && <span className="text-rose-400">● Active</span>}
                  </div>
                  <p className="text-[10px] text-stone-400">{lp.effect}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weather & Prophetic Omen */}
          <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h3 className="font-serif font-bold text-sm text-amber-200 flex items-center gap-2">
                <CloudSun className="h-4 w-4 text-amber-400" /> Météo & Présages Divins
              </h3>
              <button
                onClick={handleRollWeather}
                className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300"
                title="Tirer une nouvelle météo"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                <span className="text-[10px] text-stone-500 block uppercase font-semibold">Conditions Météorologiques</span>
                <strong className="text-amber-300 text-sm">{weatherState.weather}</strong>
              </div>

              <div className="p-2.5 rounded bg-stone-900 border border-stone-800">
                <span className="text-[10px] text-stone-500 block uppercase font-semibold">Vents d'Orlanth</span>
                <strong className="text-stone-200">{weatherState.wind}</strong>
              </div>

              <div className="p-2.5 rounded bg-stone-900 border border-amber-900/50">
                <span className="text-[10px] text-amber-400 block uppercase font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Présage Mystique
                </span>
                <p className="text-stone-300 italic pt-1 leading-relaxed">
                  "{weatherState.omen}"
                </p>
              </div>
            </div>

            <button
              onClick={handleRollWeather}
              className="w-full py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 text-xs font-serif font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Générer un Nouveau Présage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
