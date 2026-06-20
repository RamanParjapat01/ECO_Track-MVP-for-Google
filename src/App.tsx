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
    <div className="min-h-screen pb-12 bg-slate-950 text-white"> {/* Root wrapper */}
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-40">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div initial={{ rotate: -10 }} animate={{ rotate: 0 }} className="w-10 h-10 rounded-xl bg-emerald-450/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-350" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold">EcoTrack</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Carbon Footprint Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* ... baaki code waisa hi rahega ... */}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <DailyInputForm onSave={handleSave} />
            <AIAdvisor commute={currentInputs.commute} electricity={currentInputs.electricity} diet={currentInputs.diet} />
          </div>

          <section className="space-y-6">
            <DoomsdayChart dailyTotal={dailyTotal} />

            {/* Recent History - Semantic List */}
            {entries.length > 0 && (
              <article className="glass-strong p-6 md:p-8">
                <header className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Recent Entries</h2>
                    <p className="text-sm text-slate-400">Your last 5 logs</p>
                  </div>
                </header>
                <ul className="space-y-2">
                  {entries.slice(-5).reverse().map((entry, i) => (
                    <li key={entry.date + i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                      {/* ... entry content ... */}
                    </li>
                  ))}
                </ul>
              </article>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}