import React, { useRef, useEffect, useState } from 'react';
import { TranscriptEntry, TranscriptAuthor, Teacher } from '../types';
import TeacherAvatarDisplay from './TeacherAvatar';

interface ChatProps {
  messages: TranscriptEntry[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  teacher: Teacher;
  isCallActive: boolean;
  isReadOnly?: boolean;
}

const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, isLoading, teacher, isCallActive, isReadOnly }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !isCallActive && !isReadOnly) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <>
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.map((entry, index) => (
          <div key={index} className={`flex items-start gap-3 ${
              entry.author === TranscriptAuthor.USER ? 'justify-end' : 
              entry.author === TranscriptAuthor.SYSTEM ? 'justify-center' : ''
            }`
          }>
             {entry.author === TranscriptAuthor.AI && <TeacherAvatarDisplay teacher={teacher} className="w-8 h-8 rounded-full flex-shrink-0" />}
            <div className={`max-w-xs md:max-w-sm rounded-xl px-4 py-2 ${
                entry.author === TranscriptAuthor.USER
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : entry.author === TranscriptAuthor.AI
                  ? 'bg-gray-700 text-gray-200 rounded-bl-none'
                  : 'bg-gray-600/50 text-gray-400 text-sm italic'
              }`}>
              <p className="leading-relaxed whitespace-pre-wrap">{entry.text}</p>
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && messages[messages.length -1]?.author === TranscriptAuthor.USER && (
             <div className="flex items-start gap-3">
                 <TeacherAvatarDisplay teacher={teacher} className="w-8 h-8 rounded-full flex-shrink-0" isSpeaking={true} />
                 <div className="max-w-xs md:max-w-sm rounded-xl px-4 py-2 bg-gray-700 text-gray-200 rounded-bl-none">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                    </div>
                 </div>
            </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="p-4 border-t border-gray-700">
        {isReadOnly ? (
             <div className="text-center text-sm text-gray-400 py-2">
                Viewing chat history. Start a new chat to begin a conversation.
            </div>
        ) : isCallActive ? (
            <div className="text-center text-sm text-gray-400 py-2">
                Virtual call in progress...
            </div>
        ) : (
            <form onSubmit={handleSend} className="flex items-center gap-3">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 rounded-full p-3 text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
            </form>
        )}
      </div>
    </>
  );
};

export default Chat;
