import React from 'react';
import { Page } from '../types';

interface NuroChatPageProps {
  onNavigate: (page: Page) => void;
}

const NuroChatPage: React.FC<NuroChatPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900 text-white">
      {/* Hero Section */}
       <div className="py-12 px-4 text-center">
         <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Talk Smarter with Nuro — Your <span className="text-indigo-400">Intelligent Companion.</span>
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            Get instant answers, visual explanations, and creative inspiration. Switch between learning, design, and creative modes to suit your needs.
        </p>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-[600px] px-4 md:px-8 pb-8">
        <iframe
          src="https://www.nuro.chat"
          title="Nuro Chat"
          className="flex-1 w-full border-2 border-gray-700 rounded-xl"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>

      {/* Bottom CTA section */}
      <div className="flex-shrink-0 bg-gray-800/50 border-t border-gray-700 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white">Ready for a one-on-one lesson?</h2>
          <p className="text-gray-400 mt-2">
            Transition from the chat assistant to a live, interactive session with our specialized AI Teachers.
          </p>
          <button
            onClick={() => onNavigate(Page.LIVE_CLASS)}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
          >
            Enter AI Classroom
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuroChatPage;
