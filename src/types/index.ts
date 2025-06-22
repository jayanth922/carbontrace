export interface CarbonActivity {
  id: string;
  type: 'transport' | 'energy' | 'food' | 'shopping' | 'travel';
  description: string;
  carbonFootprint: number; // kg CO2
  date: Date;
  verified: boolean;
  source: 'manual' | 'ai' | 'receipt' | 'voice';
  metadata?: {
    distance?: number;
    vehicle?: string;
    energyUsage?: number;
    foodType?: string;
    productCategory?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalCarbonFootprint: number;
  monthlyGoal: number;
  streak: number;
  level: number;
  badges: Badge[];
  joinDate: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CarbonChallenge {
  id: string;
  title: string;
  description: string;
  targetReduction: number;
  duration: number; // days
  participants: number;
  reward: string;
  startDate: Date;
  endDate: Date;
  category: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  potentialSaving: number; // kg CO2
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  actionSteps: string[];
  estimatedCost?: number;
}

export interface CarbonOffset {
  id: string;
  projectName: string;
  description: string;
  pricePerTon: number;
  location: string;
  verificationStandard: string;
  available: boolean;
  impact: string;
}