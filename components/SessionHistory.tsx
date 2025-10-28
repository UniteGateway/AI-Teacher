import React, { useState } from 'react';
import { Session, TranscriptAuthor } from '../types';
import TeacherAvatarDisplay from './TeacherAvatar';

interface SessionItemProps {
  session: Session;
}

const SessionItem: React.FC<SessionItemProps> = ({ session }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-900/50 rounded-lg border border-gray-700">
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-4">
            <TeacherAvatarDisplay 
                teacher={{...session, name: session.teacherName, avatar: session.teacherAvatar, avatarUrl: session.teacherAvatarUrl, color: session.teacherColor, description: '', systemInstruction: '', id: ''}} 
                className="w-10 h-10 rounded-full flex-shrink-0" 
            />
            <div>
                <p className="font-semibold text-white">Chat with {session.teacherName}</p>
                <p className="text-xs text-gray-400">{session.date}</p>
            </div>
        </div>
        <svg 
            className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-gray-700 max-h-80 overflow-y-auto space-y-4 bg-gray-800/50">
           {session.transcript.map((entry, index) => (
             <div key={index} className={`flex items-start gap-3 ${entry.author === TranscriptAuthor.USER ? 'justify-end' : ''}`}>
                {entry.author === TranscriptAuthor.AI && (
                    <TeacherAvatarDisplay teacher={{...session, name: session.teacherName, avatar: session.teacherAvatar, avatarUrl: session.teacherAvatarUrl, color: session.teacherColor, description: '', systemInstruction: '', id: ''}} className="w-8 h-8 rounded-full flex-shrink-0" />
                )}
                <div className={`max-w-xs md:max-w-sm rounded-xl px-4 py-2 ${
                    entry.author === TranscriptAuthor.USER
                    ? `bg-indigo-600 text-white rounded-br-none`
                    : `bg-gray-700 text-gray-200 rounded-bl-none`
                }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                    <p className="text-xs text-gray-500 mt-1 text-right">{entry.timestamp}</p>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface SessionHistoryProps {
  sessions: Session[];
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions }) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-4">
      {sessions.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Your session history is empty.</p>
        </div>
      ) : (
        sessions.map(session => <SessionItem key={session.id} session={session} />)
      )}
    </div>
  );
};

export default SessionHistory;
