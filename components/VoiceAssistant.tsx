import React, { useState, useRef, useEffect } from 'react';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface VoiceAssistantProps {
    onTranscript: (transcript: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onTranscript }) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
          console.warn("Speech Recognition API not supported in this browser.");
          return;
        }

        const recognition: SpeechRecognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if(finalTranscript.trim()){
                onTranscript(finalTranscript.trim());
                // Stop listening after final transcript to act like a single command
                recognitionRef.current?.stop();
                setIsListening(false);
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };

        return () => {
            recognitionRef.current?.stop();
        };

    }, [onTranscript]);
    
    const handleToggleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error("Could not start recognition:", e);
            }
        }
    };

    return (
        <button
            onClick={handleToggleListen}
            title={isListening ? "Stop listening" : "Talk to your AI Designer"}
            className={`p-2 rounded-lg transition-colors relative ${
                isListening 
                ? 'bg-red-500/20 text-red-300' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
        >
            {isListening && <div className="absolute inset-0 rounded-lg bg-indigo-500/50 animate-ping"></div>}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
            </svg>
        </button>
    );
};

export default VoiceAssistant;