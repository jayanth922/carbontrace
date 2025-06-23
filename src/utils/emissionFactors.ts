// src/utils/emissionFactors.ts
export const transportFactors: Record<string, number> = {
  'Petrol Car': 0.192,      // kg CO₂ per km
  'Diesel Car': 0.171,
  'Electric Car': 0.050,
  'Bus': 0.105,
  'Train': 0.041,
}

export const energyFactors: Record<string, number> = {
  Electricity: 0.475,       // kg CO₂ per kWh (global avg)
  'Natural Gas': 0.202,
  'Fuel Oil': 0.267,
}

export const foodFactors: Record<string, number> = {
  Beef: 27,   // kg CO₂ per kg of meat
  Chicken: 6.9,
  Rice: 2.7,
  Vegetables: 2, // avg per kg
}
