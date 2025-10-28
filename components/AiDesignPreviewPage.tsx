import React, { useState } from 'react';
import { Page } from '../types';
import VoiceAssistant from './VoiceAssistant';

interface AiDesignPreviewPageProps {
  generatedHtml: string | null;
  prompt: string;
  onNavigate: (page: Page) => void;
  onRegenerate: (prompt: string) => Promise<{success: boolean, error?: string}>;
}

const Spinner: React.FC = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);


const AiDesignPreviewPage: React.FC<AiDesignPreviewPageProps> = ({ generatedHtml, prompt, onNavigate, onRegenerate }) => {
    const [currentPrompt, setCurrentPrompt] = useState(prompt);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('prompt');

    if (!generatedHtml) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <p className="text-xl font-semibold text-gray-400">No website generated yet.</p>
                <p className="text-gray-500 max-w-md mt-2">Go back to the design page to create one.</p>
                <button onClick={() => onNavigate(Page.AI_WEBSITE_BUILDER)} className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg">
                    &larr; Back to Designer
                </button>
            </div>
        );
    }

    const handleRegenerate = async () => {
        if (!currentPrompt.trim() || isLoading) return;
        setIsLoading(true);
        setError(null);
        
        const result = await onRegenerate(currentPrompt);
        
        if (!result.success) {
            setError(result.error || "An unknown error occurred.");
        }
        setIsLoading(false);
    };

    const handlePreviewInNewTab = () => {
        const previewHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview</title>
            </head>
            <body>
                ${generatedHtml}
            </body>
            </html>
        `;
        const blob = new Blob([previewHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    return (
        <div className="flex-1 flex flex-col p-4 md:p-6 text-white bg-gradient-to-b from-[#0f172a] to-[#1e293b] animate-fade-in min-h-screen">
            <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Preview */}
                <div className="lg:col-span-2 flex flex-col bg-gray-800/50 border border-gray-700 rounded-xl shadow-xl p-2 min-h-[80vh]">
                    <div className="bg-gray-900 p-2 rounded-t-lg flex items-center justify-between flex-shrink-0">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="flex items-center gap-2">
                             <button onClick={handlePreviewInNewTab} title="Open in new tab" className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md">
                                🔍
                             </button>
                             <button onClick={() => onNavigate(Page.AI_WEBSITE_BUILDER)} className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md" title="Back to Designer">
                                &larr; Back
                             </button>
                        </div>
                    </div>
                    <iframe
                        srcDoc={generatedHtml}
                        title="Generated Website Preview"
                        className="w-full flex-1 bg-white rounded-b-lg border-0"
                        sandbox="allow-scripts allow-same-origin"
                    />
                </div>

                {/* Right Panel: Controls */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex-grow flex flex-col shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-4">Smart AI Assistant</h3>
                        
                        <div className="flex border-b border-gray-700 mb-4">
                            <button onClick={() => setActiveTab('prompt')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'prompt' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}>Edit</button>
                            <button className="px-4 py-2 text-sm font-semibold text-gray-600 cursor-not-allowed">Themes</button>
                            <button className="px-4 py-2 text-sm font-semibold text-gray-600 cursor-not-allowed">Publish</button>
                        </div>

                        <div className="flex-grow flex flex-col">
                            <p className="text-sm text-gray-400 mb-2">Refine your design. Edit the prompt or use your voice.</p>
                             <textarea
                                value={currentPrompt}
                                onChange={(e) => setCurrentPrompt(e.target.value)}
                                className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="flex items-center gap-2 mt-2">
                                <VoiceAssistant onTranscript={setCurrentPrompt} />
                                <button 
                                    onClick={handleRegenerate} 
                                    disabled={isLoading}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Spinner /> : 'Regenerate'}
                                </button>
                            </div>
                            {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}

                             <hr className="my-6 border-gray-700"/>
                             <h4 className="text-md font-semibold text-white mb-3">Customize Sections</h4>
                             <div className="grid grid-cols-2 gap-2">
                                <button className="text-xs p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-center">Add Blog</button>
                                <button className="text-xs p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-center">Add Gallery</button>
                                <button className="text-xs p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-center">Add Contact Form</button>
                                <button className="text-xs p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-center">Change Colors</button>
                             </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button onClick={() => onNavigate(Page.AI_WEBSITE_BUILDER)} className="text-indigo-400 hover:underline text-sm font-semibold">
                                Try Another Idea
                            </button>
                        </div>
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                animation: fade-in 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AiDesignPreviewPage;