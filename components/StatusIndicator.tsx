
import React from 'react';
import { CallStatus } from '../types';

interface StatusIndicatorProps {
  status: CallStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case CallStatus.CONNECTING:
        return { text: 'Connecting...', color: 'bg-yellow-500', pulse: true };
      case CallStatus.ACTIVE:
      case CallStatus.LISTENING:
        return { text: 'Listening...', color: 'bg-blue-500', pulse: true };
      case CallStatus.SPEAKING:
        return { text: 'Speaking...', color: 'bg-indigo-500', pulse: true };
      case CallStatus.ENDED:
        return { text: 'Call Ended', color: 'bg-gray-500', pulse: false };
      case CallStatus.ERROR:
        return { text: 'Connection Error', color: 'bg-red-500', pulse: false };
      case CallStatus.IDLE:
      default:
        return { text: 'Ready to Connect', color: 'bg-green-500', pulse: false };
    }
  };

  const { text, color, pulse } = getStatusInfo();

  return (
    <div className="flex items-center justify-center gap-3 p-4 bg-gray-800/50 rounded-lg">
      <div className="relative flex items-center justify-center w-6 h-6">
        <div className={`${color} w-3 h-3 rounded-full`}></div>
        {pulse && <div className={`${color} w-6 h-6 rounded-full absolute animate-ping opacity-75`}></div>}
      </div>
      <span className="text-lg font-medium text-gray-300">{text}</span>
    </div>
  );
};

export default StatusIndicator;
