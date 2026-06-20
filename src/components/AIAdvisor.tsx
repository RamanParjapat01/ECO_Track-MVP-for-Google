import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, X, Loader2 } from 'lucide-react';
import { calculateDailyCo2 } from '../types';

interface Props {
  commute: number;
  electricity: number;
  diet: 'vegan' | 'vegetarian' | 'non-veg';
}

function getHighestCategory(commute: number, electricity: number, diet: 'vegan' | 'vegetarian' | 'non-veg') {
  const commuteCo2 = commute * 0.2;
  const electricityCo2 = electricity * 0.4;
  const dietCo2 = { vegan: 0.2, vegetarian: 0.5, 'non-veg': 2.5 }[diet];

  if (commuteCo2 >= electricityCo2 && commuteCo2 >= dietCo2) return 'commute';
  if (electricityCo2 >= commuteCo2 && electricityCo2 >= dietCo2) return 'electricity';
  return 'diet';
}

function generateTip(category: string, value: number): string {
  if (category === 'commute') {
    if (value > 15) return "Your commute emissions are significantly high. Consider switching to an EV, using public transit, or forming a carpool. Even remote work 2 days a week could cut this by 40%.";
    if (value > 5) return "Your commute is your biggest emission source. Try cycling for short trips, using buses/trains, or an electric scooter. Every km avoided saves 0.2 kg CO₂.";
    return "Your commute is relatively efficient. Keep it up! Consider walking or cycling for even shorter trips to push lower.";
  }
  if (category === 'electricity') {
    if (value > 10) return "Your electricity usage is very high. Switch to LED bulbs, unplug idle devices, and consider solar panels. A smart thermostat can reduce HVAC costs by 15%.";
    if (value > 5) return "Electricity is your top emitter. Use energy-efficient appliances, air-dry clothes, and run dishwashers/washing machines on eco mode.";
    return "Your electricity use is well-managed. Small wins: use power strips to eliminate phantom loads from standby devices.";
  }
  if (category === 'diet') {
    return "Diet is your biggest footprint. Try 'Meatless Mondays' or swap beef for chicken/fish. A plant-rich diet can cut food emissions by up to 70%. Even one vegan day a week makes a dent.";
  }
  return "Keep tracking your habits. Small consistent changes compound into massive impact over time.";
}

export default function AIAdvisor({ commute, electricity, diet }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tip, setTip] = useState('');
  const [typedText, setTypedText] = useState('');

  const handleGetInsights = useCallback(() => {
    const total = calculateDailyCo2({ commute, electricity, diet });
    if (total === 0) {
      setTip("Enter some data first so I can analyze your carbon footprint!");
      setOpen(true);
      setTypedText("");
      let i = 0;
      const text = "Enter some data first so I can analyze your carbon footprint!";
      const interval = setInterval(() => {
        i++;
        setTypedText(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, 25);
      return;
    }

    setOpen(true);
    setLoading(true);
    setTypedText('');
    setTip('');

    setTimeout(() => {
      const category = getHighestCategory(commute, electricity, diet);
      const catValue = category === 'commute' ? commute * 0.2 : category === 'electricity' ? electricity * 0.4 : { vegan: 0.2, vegetarian: 0.5, 'non-veg': 2.5 }[diet];
      const generated = generateTip(category, catValue);
      setTip(generated);
      setLoading(false);

      let i = 0;
      const interval = setInterval(() => {
        i++;
        setTypedText(generated.slice(0, i));
        if (i >= generated.length) clearInterval(interval);
      }, 18);
    }, 1200);
  }, [commute, electricity, diet]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-strong p-6 md:p-8 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Ask Gemini</h2>
          <p className="text-sm text-slate-400">AI-powered eco insights</p>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <span className="text-sm font-medium text-violet-300">Gemini</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                  <span className="text-sm text-slate-400">Analyzing your footprint...</span>
                </div>
              ) : (
                <div className="text-sm text-slate-200 leading-relaxed min-h-[3rem]">
                  <span className="typing-cursor">{typedText}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleGetInsights}
        className="w-full bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 hover:border-violet-500/50 text-violet-300 font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
      >
        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        Get AI Insights
      </button>
    </motion.div>
  );
}
