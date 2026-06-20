export interface DailyEntry {
  commute: number;
  electricity: number;
  diet: 'vegan' | 'vegetarian' | 'non-veg';
  date: string;
  totalCo2: number;
}

export const DIET_CO2: Record<DailyEntry['diet'], number> = {
  vegan: 0.2,
  vegetarian: 0.5,
  'non-veg': 2.5,
};

export const COMMUTE_RATE = 0.2;
export const ELECTRICITY_RATE = 0.4;
export const GLOBAL_TARGET_YEARLY = 2000;

export function calculateDailyCo2(entry: Omit<DailyEntry, 'date' | 'totalCo2'>) {
  const commuteCo2 = entry.commute * COMMUTE_RATE;
  const electricityCo2 = entry.electricity * ELECTRICITY_RATE;
  const dietCo2 = DIET_CO2[entry.diet];
  return Number((commuteCo2 + electricityCo2 + dietCo2).toFixed(2));
}
