
import React, { useRef, useEffect } from 'react';
import { TranscriptEntry, TranscriptAuthor } from '../types';

interface TranscriptionViewerProps {
  transcripts: TranscriptEntry[];
}

const AuthorLabel: React.FC<{ author: TranscriptAuthor }> = ({ author }) => {
  const baseClasses = "text-xs font-bold px-2 py-0.5 rounded-full";
  switch (author) {
    case TranscriptAuthor.USER:
      return <span className={`${baseClasses} bg-blue-500/20 text-blue-300`}>You</span>;
    case TranscriptAuthor.AI:
      return <span className={`${baseClasses} bg-indigo-500/20 text-indigo-300`}>Nuro AI</span>;
    case TranscriptAuthor.SYSTEM:
       return <span className={`${baseClasses} bg-gray-500/20 text-gray-300`}>System</span>;
    default:
      return null;
  }
};

const TranscriptionViewer: React.FC<TranscriptionViewerProps> = ({ transcripts }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  return (
    <div className="flex-1 bg-gray-900/70 rounded-lg p-6 overflow-y-auto space-y-6">
      {transcripts.length === 0 ? (
        <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Call transcript will appear here...</p>
        </div>
      ) : (
        transcripts.map((entry, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <AuthorLabel author={entry.author} />
              <span className="text-xs text-gray-500">{entry.timestamp}</span>
            </div>
            <p className="text-gray-200 leading-relaxed">{entry.text}</p>
          </div>
        ))
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default TranscriptionViewer;
