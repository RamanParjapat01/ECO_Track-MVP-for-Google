import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Zap,
  Utensils,
  Leaf,
  Award,
  TrendingDown,
  Save,
} from 'lucide-react';
import type { DailyEntry } from '../types';
import { calculateDailyCo2, DIET_CO2 } from '../types';

interface Props {
  onSave: (entry: DailyEntry) => void;
}

export default function DailyInputForm({ onSave }: Props) {
  const [commute, setCommute] = useState('');
  const [electricity, setElectricity] = useState('');
  const [diet, setDiet] = useState<DailyEntry['diet']>('vegetarian');
  const [showBadge, setShowBadge] = useState(false);

  const commuteNum = parseFloat(commute) || 0;
  const electricityNum = parseFloat(electricity) || 0;

  const totalCo2 = calculateDailyCo2({
    commute: commuteNum,
    electricity: electricityNum,
    diet,
  });

  const isEcoWarrior = totalCo2 > 0 && totalCo2 < 5;

  const handleSave = useCallback(() => {
    if (commuteNum === 0 && electricityNum === 0) return;
    const entry: DailyEntry = {
      commute: commuteNum,
      electricity: electricityNum,
      diet,
      date: new Date().toISOString(),
      totalCo2,
    };
    onSave(entry);
    setCommute('');
    setElectricity('');
    setShowBadge(true);
    setTimeout(() => setShowBadge(false), 4000);
  }, [commuteNum, electricityNum, diet, totalCo2, onSave]);

  const commuteCo2 = (commuteNum * 0.2).toFixed(2);
  const electricityCo2 = (electricityNum * 0.4).toFixed(2);
  const dietCo2 = DIET_CO2[diet].toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-strong p-6 md:p-8 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-450/20 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-emerald-350" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Daily Input</h2>
          <p className="text-sm text-slate-400">Log your carbon footprint</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Car className="w-4 h-4 text-emerald-350" />
            Commute Distance (km)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={commute}
            onChange={(e) => setCommute(e.target.value)}
            placeholder="e.g. 12.5"
            className="input-glass w-full"
          />
          {commuteNum > 0 && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-xs text-emerald-350/80"
            >
              {commuteCo2} kg CO₂ from commute
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Zap className="w-4 h-4 text-amber-400" />
            Electricity Usage (kWh)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={electricity}
            onChange={(e) => setElectricity(e.target.value)}
            placeholder="e.g. 8.2"
            className="input-glass w-full"
          />
          {electricityNum > 0 && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-xs text-amber-400/80"
            >
              {electricityCo2} kg CO₂ from electricity
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Utensils className="w-4 h-4 text-rose-400" />
            Diet Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['vegan', 'vegetarian', 'non-veg'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDiet(d)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${diet === d
                  ? 'bg-emerald-450/20 border-emerald-450/50 text-emerald-350'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
              >
                {d === 'non-veg' ? 'Non-Veg' : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            {dietCo2} kg CO₂ / day from diet
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-350" />
            <span className="text-sm text-slate-300">Daily Total</span>
          </div>
          <motion.span
            key={totalCo2}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-2xl font-bold ${totalCo2 < 5 ? 'text-emerald-350' : totalCo2 < 10 ? 'text-amber-400' : 'text-rose-400'
              }`}
          >
            {totalCo2.toFixed(2)} kg CO₂
          </motion.span>
        </div>

        <AnimatePresence>
          {isEcoWarrior && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-4"
            >
              <div className="badge-glow bg-emerald-450/10 border border-emerald-450/30 rounded-xl p-3 flex items-center gap-3">
                <Award className="w-6 h-6 text-emerald-350" />
                <div>
                  <p className="text-sm font-semibold text-emerald-350">
                    Top 10% Eco-Warrior
                  </p>
                  <p className="text-xs text-emerald-350/70">
                    Your footprint is under 5 kg today!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleSave}
          disabled={commuteNum === 0 && electricityNum === 0}
          aria-label="Save carbon footprint data" // Ye line add karni hai
          className="... (aapki existing classes)"
        >
          Save
        </button>
      </div>

      <AnimatePresence>
        {showBadge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="badge-glow bg-emerald-450 text-white px-6 py-3 rounded-full font-semibold shadow-2xl flex items-center gap-2">
              <Award className="w-5 h-5" />
              Entry saved successfully!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
