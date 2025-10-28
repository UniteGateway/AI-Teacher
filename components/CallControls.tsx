import React from 'react';
import { CallStatus } from '../types';
import StatusIndicator from './StatusIndicator';

interface CallControlsProps {
    status: CallStatus;
    isMuted: boolean;
    onStart: () => void;
    onEnd: () => void;
    onToggleMute: () => void;
    disabled?: boolean;
}

const IconButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string, title: string, disabled?: boolean, isGlowing?: boolean }> = ({ onClick, children, className, title, disabled, isGlowing }) => (
    <button
        onClick={onClick}
        title={title}
        disabled={disabled}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ease-in-out shadow-lg transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${className} ${isGlowing ? 'shadow-[0_0_15px_3px_rgba(129,140,248,0.6)] animate-pulse' : ''}`}
    >
        {children}
    </button>
);

const CallControls: React.FC<CallControlsProps> = ({ status, isMuted, onStart, onEnd, onToggleMute, disabled }) => {
    
    if (status === CallStatus.IDLE || status === CallStatus.ENDED || status === CallStatus.ERROR) {
        return (
            <div className="flex flex-col items-center gap-4 py-4">
                <button onClick={onStart} disabled={status === CallStatus.ENDED || disabled} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-3 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>
                    Start Virtual Call
                </button>
                 <p className="text-sm text-gray-400 h-5">{status === CallStatus.IDLE && !disabled ? 'Or say "Start Call"' : ''}</p>
                 {status === CallStatus.ENDED && <p className="text-sm text-green-400">Call concluded.</p>}
                 {status === CallStatus.ERROR && <p className="text-sm text-red-400">Connection failed.</p>}
            </div>
        );
    }

    const isCallActive = status === CallStatus.ACTIVE || status === CallStatus.CONNECTING || status === CallStatus.LISTENING || status === CallStatus.SPEAKING;

    return (
        <div className="w-full flex flex-col items-center gap-4 py-4">
            <StatusIndicator status={status} />
             <div className="flex items-center gap-4 mt-2">
                <IconButton 
                    onClick={onToggleMute} 
                    disabled={disabled} 
                    className={isMuted ? 'bg-yellow-500 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'} 
                    title={isMuted ? 'Unmute Microphone (or say "Unmute")' : 'Mute Microphone (or say "Mute")'}
                    isGlowing={isCallActive && !isMuted}
                >
                    {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>
                    )}
                </IconButton>
                <IconButton 
                    onClick={onEnd} 
                    disabled={disabled} 
                    className="bg-red-600 hover:bg-red-700 text-white" 
                    title={'End Call (or say "End Call")'}
                    isGlowing={isCallActive}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2.05v1.59a2 2 0 0 1-2.18 2.18a19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h1.59a2 2 0 0 1 2.05 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L6.09 9.91a16 16 0 0 0 2.6 3.4z"/></svg>
                </IconButton>
             </div>
        </div>
    );
};

export default CallControls;