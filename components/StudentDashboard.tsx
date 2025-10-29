import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat as GeminiChat, LiveSession, LiveServerMessage, Modality, Blob, FunctionDeclaration, Type, GenerateContentResponse } from '@google/genai';
import { jsPDF } from 'jspdf';
import { Teacher, TranscriptEntry, TranscriptAuthor, CallStatus, Session, LearningGoal, GoalStatus, User, Group, Voice, ChatMessage } from '../types';
import { getGroups } from '../supabaseClient';
import Blackboard from './Blackboard';
import Chat from './Chat';
import AdBanner from './AdBanner';
import TeacherAvatarDisplay from './TeacherAvatar';
import CallControls from './CallControls';
import AnalyticsChart from './AnalyticsChart';
import SessionHistory from './SessionHistory';
import TabSelector from './TabSelector';
import LearningGoals from './LearningGoals';
import GroupsView from './GroupsView';
import GroupDetailView from './GroupDetailView';
import VoiceSelector from './VoiceSelector';
import VideoGenerator from './VideoGenerator';


interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

// --- Helper Functions for Audio Processing ---
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

// --- Function Declarations for Gemini ---
const searchVideosFunctionDeclaration: FunctionDeclaration = {
  name: 'search_videos',
  parameters: {
    type: Type.OBJECT,
    description: 'Search for a relevant, non-YouTube, stock video to display on the blackboard to help explain a topic.',
    properties: {
      query: {
        type: Type.STRING,
        description: 'A simple, concise search query for the video topic, e.g., "photosynthesis" or "roman empire".',
      },
    },
    required: ['query'],
  },
};

const searchYoutubeFunctionDeclaration: FunctionDeclaration = {
  name: 'search_youtube',
  parameters: {
    type: Type.OBJECT,
    description: 'Search for and display a YouTube video on the blackboard to help explain a topic. Prefer this for specific, educational content.',
    properties: {
      query: {
        type: Type.STRING,
        description: 'A concise search query for the YouTube video, e.g., "how do magnets work" or "history of ancient egypt".',
      },
    },
    required: ['query'],
  },
};

const speakTermFunctionDeclaration: FunctionDeclaration = {
  name: 'speak_term',
  parameters: {
    type: Type.OBJECT,
    description: 'Pronounce a specific historical term, name, or phrase clearly using text-to-speech to ensure the student hears the correct pronunciation.',
    properties: {
      term: {
        type: Type.STRING,
        description: 'The exact word or phrase to be pronounced.',
      },
    },
    required: ['term'],
  },
};


interface StudentDashboardProps {
    ai: GoogleGenAI;
    currentUser: User;
    initialSessionData: Session | { teacher: Teacher, transcript: TranscriptEntry[] };
    isReadOnly: boolean;
    selectedTeacher?: Teacher; // Only for live chats
    onUpdateTranscript: (transcript: TranscriptEntry[]) => void;
    onSessionEnd: (transcript: TranscriptEntry[]) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
    ai, 
    currentUser, 
    initialSessionData,
    isReadOnly,
    selectedTeacher,
    onUpdateTranscript,
    onSessionEnd
}) => {
  const teacherInfo = 'teacher' in initialSessionData ? initialSessionData.teacher : {
      id: '',
      name: initialSessionData.teacherName,
      avatar: initialSessionData.teacherAvatar,
      avatarUrl: initialSessionData.teacherAvatarUrl,
      color: initialSessionData.teacherColor,
      description: '',
      systemInstruction: '',
      voice: initialSessionData.voice,
      availableVoices: initialSessionData.availableVoices,
  };
  
  const [chatHistory, setChatHistory] = useState<TranscriptEntry[]>(initialSessionData.transcript || []);
  const [blackboardContent, setBlackboardContent] = useState<string>(
      chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].text : `Hello! I'm ${teacherInfo.name}. What shall we learn about today?`
  );
  const [isBlackboardTyping, setIsBlackboardTyping] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.IDLE);
  const [isMicrophoneMuted, setIsMicrophoneMuted] = useState(false);
  const [isBlackboardMaximized, setIsBlackboardMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'history' | 'goals' | 'groups' | 'video'>('chat');
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(teacherInfo.voice);

  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [videoGenerationProgress, setVideoGenerationProgress] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoGenerationError, setVideoGenerationError] = useState<string | null>(null);
  
  const isCallActive = callStatus === CallStatus.ACTIVE || callStatus === CallStatus.LISTENING || callStatus === CallStatus.SPEAKING || callStatus === CallStatus.CONNECTING;

  const chatRef = useRef<GeminiChat | null>(null);
  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
  
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);

  // Live API state refs
  const nextStartTimeRef = useRef(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const currentInputTranscriptRef = useRef('');
  const currentOutputTranscriptRef = useRef('');

  useEffect(() => {
      onUpdateTranscript(chatHistory);
  }, [chatHistory, onUpdateTranscript]);

  useEffect(() => {
    if (selectedTeacher && !isReadOnly) {
        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: selectedTeacher.systemInstruction,
                tools: [{functionDeclarations: [searchVideosFunctionDeclaration, searchYoutubeFunctionDeclaration, speakTermFunctionDeclaration]}],
            },
        });
        if (chatHistory.length === 0) {
            setBlackboardContent(`Hello! I'm ${selectedTeacher.name}. You can chat with me here or start a virtual call.`);
        }
    }
  }, [selectedTeacher, ai, isReadOnly, chatHistory.length]);

  useEffect(() => {
    const fetchGroups = async () => {
        const fetchedGroups = await getGroups();
        setGroups(fetchedGroups);
    };
    fetchGroups();
  }, []);
  
  const handleSendMessage = async (message: string) => {
      if (!chatRef.current || isLoading || isReadOnly) return;

      setIsLoading(true);
      const userMessage: TranscriptEntry = { author: TranscriptAuthor.USER, text: message, timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) };
      setChatHistory(prev => [...prev, userMessage]);
      setBlackboardContent('');
      setVideoUrl(null);
      setYoutubeEmbedUrl(null);

      try {
          const response: GenerateContentResponse = await chatRef.current.sendMessage({ message });
          
          if (response.functionCalls && response.functionCalls.length > 0) {
              const fc = response.functionCalls[0];
              let resultText = "I've performed the requested action.";
              let toolUsedToDisplayMedia = false;
              
              if (fc.name === 'search_youtube') {
                  const query = fc.args.query as string;
                  const embedUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;
                  setYoutubeEmbedUrl(embedUrl);
                  resultText = `I've found a YouTube video about "${query}" for you to watch on the blackboard.`;
                  toolUsedToDisplayMedia = true;
              } else if (fc.name === 'search_videos') {
                   await fetchAndDisplayVideo(fc.args.query as string);
                   resultText = `I am showing a video about "${fc.args.query as string}".`;
                   toolUsedToDisplayMedia = true;
              }
              
               const aiMessage: TranscriptEntry = { author: TranscriptAuthor.AI, text: resultText, timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) };
               setChatHistory(prev => [...prev, aiMessage]);
               if (!toolUsedToDisplayMedia) {
                   setBlackboardContent(resultText);
                   setIsBlackboardTyping(false);
               }

          } else {
              const aiResponseText = response.text;
              const aiMessage: TranscriptEntry = { author: TranscriptAuthor.AI, text: aiResponseText, timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) };
              setChatHistory(prev => [...prev, aiMessage]);
              setBlackboardContent(aiResponseText);
              setIsBlackboardTyping(false);
          }

      } catch (error) {
          console.error("Error sending message:", error);
          const errorMessage: TranscriptEntry = { author: TranscriptAuthor.AI, text: "I'm sorry, I encountered an error. Please try again.", timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) };
          setChatHistory(prev => [...prev, errorMessage]);
          setBlackboardContent("Oops! Something went wrong.");
      } finally {
          setIsLoading(false);
      }
  };

  const endCall = useCallback(() => {
    sessionPromiseRef.current?.then(session => session.close());
    sessionPromiseRef.current = null;
    
    inputAudioContextRef.current?.close().catch(() => {});
    outputAudioContextRef.current?.close().catch(() => {});
    
    setVideoUrl(null);
    setYoutubeEmbedUrl(null);
    setCallStatus(CallStatus.ENDED);
    setIsMicrophoneMuted(false);
    setTimeout(() => setCallStatus(CallStatus.IDLE), 2000);
    onSessionEnd(chatHistory);
  }, [chatHistory, onSessionEnd]);

  const fetchAndDisplayVideo = async (query: string) => {
    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
    if (!PEXELS_API_KEY) {
        console.error("Pexels API key is not set.");
        return "Pexels API key not configured.";
    }
    try {
        const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=1`, {
            headers: { Authorization: PEXELS_API_KEY }
        });
        if (!response.ok) throw new Error('Failed to fetch video from Pexels.');
        
        const data = await response.json();
        const video = data.videos?.[0];

        if (video) {
            const videoFile = video.video_files.find((f: any) => f.quality === 'hd') || video.video_files[0];
            setVideoUrl(videoFile.link);
            setYoutubeEmbedUrl(null);
            setBlackboardContent('');
            return `Successfully displayed a video about ${query}.`;
        } else {
            return `Could not find a suitable video for ${query}.`;
        }
    } catch (error) {
        console.error("Error fetching video:", error);
        return "An error occurred while trying to fetch a video.";
    }
  };

    const startCall = useCallback(async () => {
        if (isReadOnly || !selectedTeacher || isCallActive) return;
        setCallStatus(CallStatus.CONNECTING);
        setChatHistory(prev => [...prev, { author: TranscriptAuthor.SYSTEM, text: 'Virtual call started.', timestamp: new Date().toLocaleTimeString() }]);

        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        nextStartTimeRef.current = 0;
        audioSourcesRef.current.clear();
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setCallStatus(CallStatus.ACTIVE);
                        const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            if (isMicrophoneMuted) return;
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        setCallStatus(CallStatus.SPEAKING);

                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscriptRef.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscriptRef.current += message.serverContent.outputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            const finalInput = currentInputTranscriptRef.current.trim();
                            const finalOutput = currentOutputTranscriptRef.current.trim();

                            if (finalInput) {
                                setChatHistory(prev => [...prev, { author: TranscriptAuthor.USER, text: finalInput, timestamp: new Date().toLocaleTimeString() }]);
                            }
                            if (finalOutput) {
                                setChatHistory(prev => [...prev, { author: TranscriptAuthor.AI, text: finalOutput, timestamp: new Date().toLocaleTimeString() }]);
                                setBlackboardContent(finalOutput);
                                setIsBlackboardTyping(false);
                            }
                            
                            currentInputTranscriptRef.current = '';
                            currentOutputTranscriptRef.current = '';
                        }
                        
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (base64Audio) {
                            const outputContext = outputAudioContextRef.current!;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputContext, 24000, 1);
                            const source = outputContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputContext.destination);
                            source.addEventListener('ended', () => {
                                audioSourcesRef.current.delete(source);
                                if (audioSourcesRef.current.size === 0) {
                                    setCallStatus(CallStatus.ACTIVE);
                                }
                            });
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            audioSourcesRef.current.add(source);
                        } else {
                             setCallStatus(CallStatus.ACTIVE);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setCallStatus(CallStatus.ERROR);
                        setChatHistory(prev => [...prev, { author: TranscriptAuthor.SYSTEM, text: `Connection error: ${e.message}`, timestamp: new Date().toLocaleTimeString() }]);
                        endCall();
                    },
                    onclose: () => {
                       stream.getTracks().forEach(track => track.stop());
                       setCallStatus(CallStatus.IDLE);
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice?.name || 'Zephyr' } } },
                    systemInstruction: selectedTeacher.systemInstruction,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
            });
        } catch (error) {
            console.error("Failed to start call:", error);
            setCallStatus(CallStatus.ERROR);
        }
    }, [ai, isReadOnly, selectedTeacher, isCallActive, selectedVoice, isMicrophoneMuted, endCall]);
  
  const handleToggleMute = useCallback(() => setIsMicrophoneMuted(prev => !prev), []);
  
  // Manages the lifecycle of the Web Speech API for voice commands to prevent microphone conflicts.
  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    // Voice commands are disabled if the API is unsupported, the view is read-only, or a call is active.
    if (!SpeechRecognitionAPI || isReadOnly || isCallActive) {
      // The cleanup function from the previous render will handle stopping any active recognition.
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognitionAPI();
    recognition.continuous = false; // Stop after one utterance.
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    speechRecognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        
        // This effect only runs when a call is idle, so we only need to listen for the "start call" command.
        if (/(start|begin) call/.test(transcript)) {
            startCall();
        }
    };

    recognition.onerror = (event: any) => {
        // The 'audio-capture' error is common if the mic is busy. By disabling this during calls,
        // we prevent that conflict. We still log other errors.
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
            console.error('Speech recognition error:', event.error);
        }
    };
    
    recognition.onend = () => {
        // Automatically restart recognition after it stops, but only if this instance is still active.
        if (speechRecognitionRef.current === recognition) {
            try { 
                recognition.start();
            } catch (e) { 
                // This might fail if the state changed and the component is stopping recognition.
            }
        }
    };

    try { 
        recognition.start(); 
    } catch(e) { 
        console.error("Speech recognition could not start.", e); 
    }

    return () => {
        if (speechRecognitionRef.current) {
            // Detach handlers and stop to prevent memory leaks or unwanted restarts.
            speechRecognitionRef.current.onend = null;
            speechRecognitionRef.current.onresult = null;
            speechRecognitionRef.current.onerror = null;
            speechRecognitionRef.current.stop();
            speechRecognitionRef.current = null;
        }
    };
  }, [isCallActive, isReadOnly, startCall]);

  // --- UI Handlers ---
  const handleAddGoal = (text: string) => setLearningGoals(prev => [{ id: `goal-${Date.now()}`, text, status: GoalStatus.TODO }, ...prev]);
  const handleUpdateGoalStatus = (id: string, status: GoalStatus) => setLearningGoals(prev => prev.map(goal => goal.id === id ? { ...goal, status } : goal));
  const handleDeleteGoal = (id: string) => setLearningGoals(prev => prev.filter(goal => goal.id !== id));
  const handleDiscussGoal = (goalText: string) => { setActiveTab('chat'); handleSendMessage(`Let's discuss my learning goal: "${goalText}"`); };
  const handleCreateGroup = (name: string, description: string) => setGroups(prev => [{ id: `group-${Date.now()}`, name, description, members: [currentUser], chatHistory: [] }, ...prev]);
  const handleJoinGroup = (group: Group) => setGroups(prev => prev.map(g => g.id === group.id ? {...g, members: [...g.members, currentUser]} : g));
  const handleLeaveGroup = (group: Group) => setGroups(prev => prev.map(g => g.id === group.id ? {...g, members: g.members.filter(m => m.id !== currentUser.id)} : g));
  const handleSendGroupMessage = (groupId: string, messageText: string) => { /* Mocked */ };
  const handleGenerateVideo = async (prompt: string) => { /* Mocked */ };
  
    const handleDownloadNotes = () => {
        if (!teacherInfo || chatHistory.length === 0) return;

        const doc = new jsPDF();
        
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(`Conversation with ${teacherInfo.name}`, 10, 10);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(new Date().toLocaleString(), 10, 16);

        let yPosition = 30;
        
        chatHistory.forEach(entry => {
            if (yPosition > 280) { // Add new page if content overflows
                doc.addPage();
                yPosition = 10;
            }

            const author = entry.author;
            const text = entry.text;
            
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(12);
            
            let authorName = '';
            if (author === TranscriptAuthor.USER) {
                doc.setTextColor(6, 6, 168); // Blue for User
                authorName = `${currentUser.name}:`;
            } else if (author === TranscriptAuthor.AI) {
                doc.setTextColor(76, 4, 107); // Indigo for AI
                authorName = `${teacherInfo.name}:`;
            } else { // System
                doc.setTextColor(128, 128, 128); // Gray for System
                authorName = "System:";
            }
            doc.text(authorName, 10, yPosition);
            
            yPosition += 6;
            
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            
            const splitText = doc.splitTextToSize(text, 180);
            doc.text(splitText, 15, yPosition);
            
            yPosition += (splitText.length * 5) + 8; // a bit of space after each entry
        });
        
        doc.save(`Nuro-Chat-${teacherInfo.name.replace(' ', '_')}-${Date.now()}.pdf`);
    };


  const renderActiveTab = () => {
    if (selectedGroup) {
        return <GroupDetailView group={selectedGroup} onBack={() => setSelectedGroup(null)} currentUser={currentUser} onSendMessage={handleSendGroupMessage} />;
    }
    switch(activeTab) {
        case 'chat':
            return <Chat messages={chatHistory} onSendMessage={handleSendMessage} isLoading={isLoading} teacher={teacherInfo} isCallActive={isCallActive} isReadOnly={isReadOnly} />;
        case 'video':
            return <VideoGenerator onGenerate={handleGenerateVideo} isGenerating={isGeneratingVideo} progressMessage={videoGenerationProgress} generatedUrl={generatedVideoUrl} error={videoGenerationError} />;
        case 'history':
            return <SessionHistory sessions={[]} />; // This tab might be deprecated with new sidebar
        case 'goals':
            return <LearningGoals goals={learningGoals} onAddGoal={handleAddGoal} onUpdateGoalStatus={handleUpdateGoalStatus} onDeleteGoal={handleDeleteGoal} onDiscussGoal={handleDiscussGoal} />;
        case 'groups':
            return <GroupsView groups={groups} currentUser={currentUser} onCreateGroup={handleCreateGroup} onJoinGroup={handleJoinGroup} onLeaveGroup={handleLeaveGroup} onSelectGroup={setSelectedGroup} />;
        default:
            return null;
    }
  }
  
  const RightPanelHeader = () => (
    <div className="p-4 border-b border-gray-700 space-y-4">
        <div className="flex items-center gap-4">
            <TeacherAvatarDisplay 
                teacher={teacherInfo} 
                className="w-16 h-16 rounded-full border-2 border-gray-600 shadow-lg"
                isSpeaking={callStatus === CallStatus.SPEAKING || isLoading}
            />
            <div className="flex-1">
                <h2 className="text-xl font-bold text-white">Learning with <span className={`text-${teacherInfo.color}-400`}>{teacherInfo.name}</span></h2>
                {selectedVoice && (
                    <VoiceSelector voices={teacherInfo.availableVoices} selectedVoice={selectedVoice} onSelectVoice={setSelectedVoice} disabled={isCallActive || isReadOnly} />
                )}
            </div>
        </div>
        <CallControls status={callStatus} isMuted={isMicrophoneMuted} onStart={startCall} onEnd={endCall} onToggleMute={handleToggleMute} disabled={isReadOnly} />
         <button
            onClick={handleDownloadNotes}
            disabled={chatHistory.length === 0}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Notes (PDF)
        </button>
    </div>
  );

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 p-6 h-full overflow-hidden">
        <div className={`flex flex-col min-h-0 ${isBlackboardMaximized ? 'col-span-full' : 'lg:col-span-3'}`}>
             <Blackboard 
                content={blackboardContent} 
                teacher={teacherInfo} 
                videoUrl={videoUrl} 
                youtubeEmbedUrl={youtubeEmbedUrl} 
                isMaximized={isBlackboardMaximized} 
                onToggleMaximize={() => setIsBlackboardMaximized(prev => !prev)}
                isTyping={isBlackboardTyping}
             />
        </div>

        <div className={`lg:col-span-2 flex-col gap-6 min-h-0 ${isBlackboardMaximized ? 'hidden' : 'flex'}`}>
            <div className="flex-1 min-h-0 bg-gray-800/50 border border-gray-700 rounded-xl flex flex-col shadow-xl">
                 <RightPanelHeader />
                 <TabSelector activeTab={activeTab} onSelectTab={(tab) => { setActiveTab(tab); setSelectedGroup(null); }} />
                 {renderActiveTab()}
            </div>
            <div className="flex-shrink-0">
                <AnalyticsChart />
            </div>
            <div className="flex-shrink-0">
                 <AdBanner />
            </div>
        </div>
    </div>
  );
};

export default StudentDashboard;