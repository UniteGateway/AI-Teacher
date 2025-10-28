import React from 'react';
import { Voice } from '../types';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoice: Voice;
  onSelectVoice: (voice: Voice) => void;
  disabled: boolean;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ voices, selectedVoice, onSelectVoice, disabled }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoiceName = event.target.value;
    const voice = voices.find(v => v.name === selectedVoiceName);
    if (voice) {
      onSelectVoice(voice);
    }
  };

  return (
    <div className="w-full px-4">
      <label htmlFor="voice-select" className="block text-sm font-medium text-gray-400 mb-2 text-center">
        AI Voice Accent
      </label>
      <select
        id="voice-select"
        value={selectedVoice.name}
        onChange={handleChange}
        disabled={disabled}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {voices.map(voice => (
          <option key={voice.name} value={voice.name}>
            {voice.region}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VoiceSelector;
