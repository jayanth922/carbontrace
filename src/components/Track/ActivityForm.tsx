import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Car, Zap, UtensilsCrossed, ShoppingBag, Plane } from 'lucide-react';
import { useCarbonStore } from '../../store/carbonStore';
import { 
  calculateTransportFootprint, 
  calculateEnergyFootprint, 
  calculateFoodFootprint, 
  calculateShoppingFootprint 
} from '../../utils/carbonCalculations';
import toast from 'react-hot-toast';

interface ActivityFormData {
  type: 'transport' | 'energy' | 'food' | 'shopping' | 'travel';
  description: string;
  // Transport
  distance?: number;
  vehicle?: string;
  // Energy
  energyUsage?: number;
  energyType?: string;
  // Food
  foodWeight?: number;
  foodType?: string;
  // Shopping
  productCategory?: string;
  quantity?: number;
}

const ACTIVITY_TYPES = [
  { id: 'transport', label: 'Transport', icon: Car, color: 'blue' },
  { id: 'energy', label: 'Energy', icon: Zap, color: 'yellow' },
  { id: 'food', label: 'Food', icon: UtensilsCrossed, color: 'green' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'purple' },
  { id: 'travel', label: 'Travel', icon: Plane, color: 'red' },
];

const VEHICLE_OPTIONS = [
  { value: 'car_petrol', label: 'Petrol Car' },
  { value: 'car_diesel', label: 'Diesel Car' },
  { value: 'car_electric', label: 'Electric Car' },
  { value: 'bus', label: 'Bus' },
  { value: 'train', label: 'Train' },
  { value: 'plane_domestic', label: 'Domestic Flight' },
  { value: 'plane_international', label: 'International Flight' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'bicycle', label: 'Bicycle' },
  { value: 'walking', label: 'Walking' },
];

const FOOD_OPTIONS = [
  { value: 'beef', label: 'Beef' },
  { value: 'lamb', label: 'Lamb' },
  { value: 'pork', label: 'Pork' },
  { value: 'chicken', label: 'Chicken' },
  { value: 'fish', label: 'Fish' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'grains', label: 'Grains' },
  { value: 'legumes', label: 'Legumes' },
];

export default function ActivityForm() {
  const [selectedType, setSelectedType] = useState<string>('transport');
  const { addActivity } = useCarbonStore();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ActivityFormData>();

  const watchedType = watch('type') || selectedType;

  const onSubmit = async (data: ActivityFormData) => {
    let carbonFootprint = 0;
    let metadata: any = {};

    // Calculate carbon footprint based on activity type
    switch (data.type) {
      case 'transport':
        if (data.distance && data.vehicle) {
          carbonFootprint = calculateTransportFootprint(data.distance, data.vehicle);
          metadata = { vehicleType: data.vehicle, distanceKm: data.distance };
        }
        break;
      case 'energy':
        if (data.energyUsage) {
          carbonFootprint = calculateEnergyFootprint(data.energyUsage, data.energyType);
          metadata = { energyUsage: data.energyUsage, energyType: data.energyType };
        }
        break;
      case 'food':
        if (data.foodWeight && data.foodType) {
          carbonFootprint = calculateFoodFootprint(data.foodWeight, data.foodType);
          metadata = { foodWeight: data.foodWeight, foodType: data.foodType };
        }
        break;
      case 'shopping':
        if (data.productCategory) {
          carbonFootprint = calculateShoppingFootprint(data.productCategory, data.quantity || 1);
          metadata = { productCategory: data.productCategory, quantity: data.quantity };
        }
        break;
      case 'travel':
        if (data.distance) {
          carbonFootprint = calculateTransportFootprint(data.distance, 'plane_international');
          metadata = { vehicleType: 'plane_international', distanceKm: data.distance };
        }
        break;
    }

    if (carbonFootprint > 0) {
      await addActivity({
        type: data.type,
        description: data.description,
        carbon_kg: Math.round(carbonFootprint * 100) / 100,
        metadata,
      });

      toast.success('Activity tracked successfully!');
      reset();
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Track New Activity</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Activity Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Activity Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {ACTIVITY_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={type.id}
                    {...register('type', { required: true })}
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => setSelectedType(type.id)}
                  />
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${
                    isSelected ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    isSelected ? 'text-primary-900' : 'text-gray-700'
                  }`}>
                    {type.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            {...register('description', { required: 'Description is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe your activity..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Type-specific fields */}
        {watchedType === 'transport' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                {...register('distance', { required: 'Distance is required', min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                {...register('vehicle', { required: 'Vehicle type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select vehicle</option>
                {VEHICLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {watchedType === 'energy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy Usage (kWh)
              </label>
              <input
                type="number"
                step="0.1"
                {...register('energyUsage', { required: 'Energy usage is required', min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy Type
              </label>
              <select
                {...register('energyType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="electricity_grid">Grid Electricity</option>
                <option value="natural_gas">Natural Gas</option>
                <option value="heating_oil">Heating Oil</option>
              </select>
            </div>
          </div>
        )}

        {watchedType === 'food' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                {...register('foodWeight', { required: 'Weight is required', min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Type
              </label>
              <select
                {...register('foodType', { required: 'Food type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select food type</option>
                {FOOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {watchedType === 'shopping' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Category
              </label>
              <select
                {...register('productCategory', { required: 'Product category is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="clothing_new">Clothing</option>
                <option value="electronics_small">Small Electronics</option>
                <option value="electronics_large">Large Electronics</option>
                <option value="books">Books</option>
                <option value="furniture">Furniture</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                {...register('quantity')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="1"
                defaultValue="1"
              />
            </div>
          </div>
        )}

        {watchedType === 'travel' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance (km)
            </label>
            <input
              type="number"
              step="0.1"
              {...register('distance', { required: 'Distance is required', min: 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0.0"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Track Activity
        </button>
      </form>
    </div>
  );
}