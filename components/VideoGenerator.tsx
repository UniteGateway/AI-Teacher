import React, { useState } from 'react';

interface VideoGeneratorProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  progressMessage: string;
  generatedUrl: string | null;
  error: string | null;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onGenerate, isGenerating, progressMessage, generatedUrl, error }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isGenerating) {
            onGenerate(prompt.trim());
        }
    };

    return (
        <div className="flex flex-col h-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">AI Video Lab</h3>
            <p className="text-sm text-gray-400 mb-6">
                Describe a concept, and our AI will generate a short educational video to explain it. For example, "A short video explaining photosynthesis" or "A neon hologram of a cat driving at top speed".
            </p>

            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a video prompt..."
                    disabled={isGenerating}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
                <button type="submit" disabled={isGenerating || !prompt.trim()} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 rounded-full p-3 text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.66 6.54L6.8 2.69a1.75 1.75 0 0 0-2.48 0L2.2 4.81a1.75 1.75 0 0 0 0 2.48l3.85 3.85"/><path d="M14.01 3.53l6.46 6.46a2 2 0 0 1 0 2.83l-8.3 8.3a2 2 0 0 1-2.83 0l-6.46-6.46a2 2 0 0 1 0-2.83l8.3-8.3a2 2 0 0 1 2.83 0z"/><path d="m14.5 12.5 4.5 4.5"/></svg>
                </button>
            </form>

            <div className="flex-1 mt-6 flex items-center justify-center bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-700 p-4">
                {isGenerating ? (
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-white font-semibold">Generating your video...</p>
                        <p className="text-gray-400 text-sm">{progressMessage}</p>
                    </div>
                ) : error ? (
                    <div className="text-center">
                        <p className="text-red-400 font-semibold">Generation Failed</p>
                        <p className="text-gray-400 text-sm max-w-sm">{error}</p>
                    </div>
                ) : generatedUrl ? (
                    <video src={generatedUrl} controls autoPlay className="max-w-full max-h-full rounded-md"></video>
                ) : (
                    <div className="text-center text-gray-500">
                        <p>Your generated video will appear here.</p>
                        <p className="text-xs mt-1">Note: Video generation can take several minutes.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoGenerator;