import React, { useState, useEffect } from 'react';
import { Page } from '../types';

interface WatchDemoPageProps {
  onNavigate: (page: Page) => void;
}

const Spinner: React.FC = () => (
    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
);

const WatchDemoPage: React.FC<WatchDemoPageProps> = ({ onNavigate }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000); // Simulate loading for 3 seconds
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white animate-fade-in">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Experience How Nuro AI Teacher <span className="text-indigo-400">Transforms Learning</span>
                </h1>
                <p className="mt-4 text-lg text-gray-400">
                    Watch our demo and see how AI adapts to your learning style.
                </p>
            </div>

            <div className="mt-8 w-full max-w-4xl aspect-video bg-gray-900/50 rounded-2xl shadow-2xl shadow-indigo-500/10 border border-gray-700 flex items-center justify-center relative overflow-hidden">
                {isLoading ? (
                    <div className="text-center space-y-4">
                        <Spinner />
                        <p className="font-semibold text-gray-300">Loading Nuro AI Learning Experience…</p>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                            <div className="h-1 bg-indigo-500 animate-progress"></div>
                        </div>
                    </div>
                ) : (
                     <iframe
                        className="w-full h-full rounded-2xl animate-fade-in"
                        src="https://www.youtube.com/embed/u_23h-342OM?autoplay=1&mute=1&controls=1&loop=1&playlist=u_23h-342OM"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                )}
            </div>
            
            <div className="mt-8 text-center">
                 <p className="text-gray-500 text-sm">Full Nuro AI Teacher demo video coming soon.</p>
                 <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                     <button
                        onClick={() => onNavigate(Page.LIVE_CLASS)}
                        className="px-6 py-3 bg-transparent hover:bg-gray-800/50 border border-gray-600 rounded-lg font-bold transition-colors"
                    >
                        &larr; Back to AI Teacher
                    </button>
                    <button
                        onClick={() => onNavigate(Page.LOGIN)}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-transform transform hover:scale-105"
                    >
                        Sign In to Try
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
                 @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress {
                    animation: progress 3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default WatchDemoPage;
