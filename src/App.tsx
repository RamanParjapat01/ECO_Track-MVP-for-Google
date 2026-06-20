import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Leaf, BarChart3, Brain, History } from 'lucide-react';
import DailyInputForm from './components/DailyInputForm';
import DoomsdayChart from './components/DoomsdayChart';
import AIAdvisor from './components/AIAdvisor';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { DailyEntry } from './types';

export default function App() {
  const [entries, setEntries] = useLocalStorage<DailyEntry[]>('ecotrack_entries', []);
  const [latestEntry, setLatestEntry] = useState<DailyEntry | null>(null);

  const dailyTotal = useMemo(() => {
    if (latestEntry) return latestEntry.totalCo2;
    if (entries.length > 0) return entries[entries.length - 1].totalCo2;
    return 0;
  }, [latestEntry, entries]);

  const handleSave = (entry: DailyEntry) => {
    setEntries((prev) => [...prev, entry]);
    setLatestEntry(entry);
  };

  const currentInputs = useMemo(() => {
    if (latestEntry) {
      return {
        commute: latestEntry.commute,
        electricity: latestEntry.electricity,
        diet: latestEntry.diet,
      };
    }
    return { commute: 0, electricity: 0, diet: 'vegetarian' as const };
  }, [latestEntry]);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="w-10 h-10 rounded-xl bg-emerald-450/20 flex items-center justify-center"
            >
              <Leaf className="w-5 h-5 text-emerald-350" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-white">EcoTrack</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Carbon Footprint Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {entries.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                <History className="w-4 h-4" />
                <span>{entries.length} entries</span>
              </div>
            )}
            <div className="bg-emerald-450/10 border border-emerald-450/20 rounded-full px-4 py-1.5 text-sm font-medium text-emerald-350">
              {dailyTotal > 0 ? `${dailyTotal.toFixed(2)} kg` : '—'} CO₂
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <DailyInputForm onSave={handleSave} />
            <AIAdvisor
              commute={currentInputs.commute}
              electricity={currentInputs.electricity}
              diet={currentInputs.diet}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <DoomsdayChart dailyTotal={dailyTotal} />

            {/* Recent History */}
            {entries.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-strong p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Recent Entries</h2>
                    <p className="text-sm text-slate-400">Your last 5 logs</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {entries.slice(-5).reverse().map((entry, i) => (
                    <motion.div
                      key={entry.date + i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${entry.totalCo2 < 5 ? 'bg-emerald-450' : entry.totalCo2 < 10 ? 'bg-amber-400' : 'bg-rose-400'}`} />
                        <span className="text-sm text-slate-300">
                          {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-500 hidden sm:inline">{entry.commute}km · {entry.electricity}kWh · {entry.diet}</span>
                        <span className={`font-semibold ${entry.totalCo2 < 5 ? 'text-emerald-350' : entry.totalCo2 < 10 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {entry.totalCo2.toFixed(2)} kg
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
