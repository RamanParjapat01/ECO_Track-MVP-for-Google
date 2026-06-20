import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { GLOBAL_TARGET_YEARLY } from '../types';

interface Props {
  dailyTotal: number;
}

export default function DoomsdayChart({ dailyTotal }: Props) {
  const projectedYearly = dailyTotal * 365;
  const exceedsTarget = projectedYearly > GLOBAL_TARGET_YEARLY;
  const percentOfTarget = Math.min((projectedYearly / GLOBAL_TARGET_YEARLY) * 100, 200);

  const data = [
    {
      name: 'Your Projection',
      value: projectedYearly,
      color: exceedsTarget ? '#f43f5e' : '#10b981',
    },
    {
      name: 'Global Target',
      value: GLOBAL_TARGET_YEARLY,
      color: '#3b82f6',
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-xl text-sm">
          <p className="font-semibold text-white">{payload[0].payload.name}</p>
          <p className="text-slate-300">
            {payload[0].value.toLocaleString()} kg CO₂/year
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-strong p-6 md:p-8 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">2030 Forecast</h2>
          <p className="text-sm text-slate-400">Projected yearly emissions</p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={60} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <ReferenceLine
              y={GLOBAL_TARGET_YEARLY}
              stroke="#3b82f6"
              strokeDasharray="5 5"
              label={{
                value: 'Global Target',
                position: 'insideTopRight',
                fill: '#3b82f6',
                fontSize: 11,
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1200}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Your projection</span>
          <span className={`font-semibold ${exceedsTarget ? 'text-rose-400' : 'text-emerald-350'}`}>
            {projectedYearly.toLocaleString()} kg/year
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Global target (2030)</span>
          <span className="font-semibold text-blue-400">
            {GLOBAL_TARGET_YEARLY.toLocaleString()} kg/year
          </span>
        </div>

        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentOfTarget, 100)}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`h-full rounded-full ${exceedsTarget ? 'bg-rose-500' : 'bg-emerald-450'}`}
          />
        </div>

        {exceedsTarget && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-rose-300">Warning: Exceeding 2030 Target</p>
              <p className="text-xs text-rose-300/70 mt-1">
                Your projected emissions are {Math.round((projectedYearly / GLOBAL_TARGET_YEARLY - 1) * 100)}% above the global sustainable limit. Small daily changes can make a huge difference by 2030.
              </p>
            </div>
          </motion.div>
        )}

        {!exceedsTarget && projectedYearly > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-450/10 border border-emerald-450/30 rounded-xl p-4 flex items-start gap-3"
          >
            <Target className="w-5 h-5 text-emerald-350 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-350">On Track for 2030</p>
              <p className="text-xs text-emerald-350/70 mt-1">
                Great job! Your projected yearly emissions are within the global sustainable target.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
