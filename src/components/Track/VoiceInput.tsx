import React, { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function VoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    // Simulate voice recognition for demo
    setIsListening(true);
    setTranscript('');
    
    // Simulate processing
    setTimeout(() => {
      const sampleTranscripts = [
        "I drove 25 kilometers to work in my petrol car",
        "I used 15 kilowatt hours of electricity today",
        "I ate 200 grams of beef for lunch",
        "I bought a new shirt online",
        "I flew 500 kilometers for a business trip"
      ];
      
      const randomTranscript = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
      setTranscript(randomTranscript);
      setIsListening(false);
      
      toast.success('Voice input processed! Review and confirm the activity.');
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Volume2 className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Voice Input</h3>
      </div>
      
      <p className="text-gray-600 text-sm mb-6">
        Tell us about your activity and we'll automatically calculate the carbon footprint
      </p>

      <div className="text-center">
        <motion.button
          onClick={isListening ? stopListening : startListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse-green' 
              : 'bg-primary-500 hover:bg-primary-600'
          }`}
          whileTap={{ scale: 0.95 }}
          disabled={isListening}
        >
          {isListening ? (
            <MicOff className="h-8 w-8 text-white" />
          ) : (
            <Mic className="h-8 w-8 text-white" />
          )}
        </motion.button>
        
        <p className="mt-4 text-sm text-gray-600">
          {isListening ? 'Listening...' : 'Tap to start recording'}
        </p>
      </div>

      {transcript && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Detected:</p>
          <p className="text-gray-900">{transcript}</p>
          <div className="mt-3 flex space-x-2">
            <button className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700">
              Confirm
            </button>
            <button className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400">
              Edit
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500">
        <p>💡 Try saying: "I drove 20km in my electric car" or "I used 10kWh of electricity"</p>
      </div>
    </div>
  );
}