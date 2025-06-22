// Real carbon footprint calculation formulas based on scientific data

export const CARBON_FACTORS = {
  // Transport (kg CO2 per km)
  car_petrol: 0.21,
  car_diesel: 0.17,
  car_electric: 0.05,
  bus: 0.08,
  train: 0.04,
  plane_domestic: 0.25,
  plane_international: 0.15,
  motorcycle: 0.12,
  bicycle: 0,
  walking: 0,

  // Energy (kg CO2 per kWh)
  electricity_grid: 0.5,
  natural_gas: 0.2,
  heating_oil: 0.27,

  // Food (kg CO2 per kg)
  beef: 27,
  lamb: 24,
  pork: 12,
  chicken: 6,
  fish: 4,
  dairy: 3.2,
  eggs: 4.2,
  vegetables: 0.4,
  fruits: 0.7,
  grains: 1.1,
  legumes: 0.9,

  // Shopping (kg CO2 per item/category)
  clothing_new: 8,
  electronics_small: 15,
  electronics_large: 300,
  books: 1.2,
  furniture: 50,
};

export function calculateTransportFootprint(
  distance: number,
  vehicle: string
): number {
  const factor = CARBON_FACTORS[vehicle as keyof typeof CARBON_FACTORS] || 0.15;
  return distance * factor;
}

export function calculateEnergyFootprint(
  energyUsage: number,
  energyType: string = 'electricity_grid'
): number {
  const factor = CARBON_FACTORS[energyType as keyof typeof CARBON_FACTORS] || 0.5;
  return energyUsage * factor;
}

export function calculateFoodFootprint(
  weight: number,
  foodType: string
): number {
  const factor = CARBON_FACTORS[foodType as keyof typeof CARBON_FACTORS] || 2;
  return weight * factor;
}

export function calculateShoppingFootprint(
  category: string,
  quantity: number = 1
): number {
  const factor = CARBON_FACTORS[category as keyof typeof CARBON_FACTORS] || 5;
  return quantity * factor;
}

export function getCarbonIntensityLevel(footprint: number): {
  level: 'low' | 'medium' | 'high' | 'very-high';
  color: string;
  message: string;
} {
  if (footprint < 5) {
    return {
      level: 'low',
      color: 'text-green-600',
      message: 'Great! Low carbon impact',
    };
  } else if (footprint < 15) {
    return {
      level: 'medium',
      color: 'text-yellow-600',
      message: 'Moderate carbon impact',
    };
  } else if (footprint < 30) {
    return {
      level: 'high',
      color: 'text-orange-600',
      message: 'High carbon impact',
    };
  } else {
    return {
      level: 'very-high',
      color: 'text-red-600',
      message: 'Very high carbon impact',
    };
  }
}

export function formatCarbonFootprint(kg: number): string {
  if (kg < 1) {
    return `${Math.round(kg * 1000)}g CO₂`;
  } else if (kg < 1000) {
    return `${kg.toFixed(1)}kg CO₂`;
  } else {
    return `${(kg / 1000).toFixed(1)}t CO₂`;
  }
}

export function getReductionPercentage(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((previous - current) / previous) * 100;
}