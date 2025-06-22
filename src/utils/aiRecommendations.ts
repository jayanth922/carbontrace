import { CarbonActivity, AIRecommendation } from '../types';

export function generateAIRecommendations(
  activities: CarbonActivity[],
  userGoal: number
): AIRecommendation[] {
  const categoryTotals = activities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + activity.carbonFootprint;
    return acc;
  }, {} as Record<string, number>);

  const recommendations: AIRecommendation[] = [];

  // Transport recommendations
  if (categoryTotals.transport > 50) {
    recommendations.push({
      id: 'transport-1',
      title: 'Switch to Electric Vehicle',
      description: 'Based on your driving patterns, switching to an electric vehicle could reduce your transport emissions by 70%.',
      potentialSaving: categoryTotals.transport * 0.7,
      difficulty: 'hard',
      category: 'transport',
      actionSteps: [
        'Research electric vehicle options in your budget',
        'Check local charging infrastructure',
        'Calculate total cost of ownership',
        'Test drive electric vehicles',
        'Apply for government incentives'
      ],
      estimatedCost: 25000,
    });

    recommendations.push({
      id: 'transport-2',
      title: 'Use Public Transport More',
      description: 'Taking public transport 3 days a week could reduce your carbon footprint significantly.',
      potentialSaving: categoryTotals.transport * 0.4,
      difficulty: 'easy',
      category: 'transport',
      actionSteps: [
        'Download local transit apps',
        'Plan your routes in advance',
        'Get a monthly transit pass',
        'Combine trips when possible'
      ],
    });
  }

  // Energy recommendations
  if (categoryTotals.energy > 30) {
    recommendations.push({
      id: 'energy-1',
      title: 'Install Solar Panels',
      description: 'Solar panels could offset most of your home energy consumption and reduce emissions by 80%.',
      potentialSaving: categoryTotals.energy * 0.8,
      difficulty: 'hard',
      category: 'energy',
      actionSteps: [
        'Get solar assessment for your roof',
        'Compare quotes from installers',
        'Check local incentives and rebates',
        'Schedule installation',
        'Monitor energy production'
      ],
      estimatedCost: 15000,
    });

    recommendations.push({
      id: 'energy-2',
      title: 'Switch to LED Lighting',
      description: 'Replacing all bulbs with LEDs can reduce lighting energy consumption by 75%.',
      potentialSaving: categoryTotals.energy * 0.15,
      difficulty: 'easy',
      category: 'energy',
      actionSteps: [
        'Audit current lighting',
        'Purchase LED replacements',
        'Replace bulbs room by room',
        'Install smart switches for automation'
      ],
      estimatedCost: 200,
    });
  }

  // Food recommendations
  if (categoryTotals.food > 40) {
    recommendations.push({
      id: 'food-1',
      title: 'Reduce Meat Consumption',
      description: 'Having 2 plant-based days per week could reduce your food emissions by 30%.',
      potentialSaving: categoryTotals.food * 0.3,
      difficulty: 'medium',
      category: 'food',
      actionSteps: [
        'Plan plant-based meals',
        'Explore meat alternatives',
        'Learn new vegetarian recipes',
        'Start with "Meatless Monday"',
        'Track your progress'
      ],
    });

    recommendations.push({
      id: 'food-2',
      title: 'Buy Local and Seasonal',
      description: 'Choosing local, seasonal produce can reduce food transport emissions by 50%.',
      potentialSaving: categoryTotals.food * 0.2,
      difficulty: 'easy',
      category: 'food',
      actionSteps: [
        'Find local farmers markets',
        'Join a CSA program',
        'Learn what\'s in season',
        'Plan meals around seasonal produce'
      ],
    });
  }

  // Shopping recommendations
  if (categoryTotals.shopping > 20) {
    recommendations.push({
      id: 'shopping-1',
      title: 'Buy Second-Hand First',
      description: 'Choosing used items when possible can reduce shopping emissions by 60%.',
      potentialSaving: categoryTotals.shopping * 0.6,
      difficulty: 'easy',
      category: 'shopping',
      actionSteps: [
        'Check thrift stores first',
        'Use online marketplaces',
        'Join local buy-nothing groups',
        'Repair instead of replace when possible'
      ],
    });
  }

  // Sort by potential impact
  return recommendations
    .sort((a, b) => b.potentialSaving - a.potentialSaving)
    .slice(0, 6); // Return top 6 recommendations
}

export function getPersonalizedTips(activities: CarbonActivity[]): string[] {
  const tips: string[] = [];
  
  const recentActivities = activities.slice(0, 10);
  const hasTransport = recentActivities.some(a => a.type === 'transport');
  const hasHighEnergyUsage = recentActivities.some(a => a.type === 'energy' && a.carbonFootprint > 10);
  const hasHighFoodImpact = recentActivities.some(a => a.type === 'food' && a.carbonFootprint > 15);

  if (hasTransport) {
    tips.push('💡 Try combining multiple errands into one trip to reduce transport emissions');
  }

  if (hasHighEnergyUsage) {
    tips.push('🌡️ Lowering your thermostat by 2°C can reduce heating emissions by 10%');
  }

  if (hasHighFoodImpact) {
    tips.push('🥗 Plant-based proteins like lentils have 90% lower emissions than beef');
  }

  tips.push('♻️ Recycling one aluminum can saves enough energy to power a TV for 3 hours');
  tips.push('🚿 A 5-minute shorter shower can save 12kg of CO₂ per month');
  tips.push('📱 Keeping devices longer reduces e-waste and manufacturing emissions');

  return tips;
}