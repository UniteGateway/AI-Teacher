import React, { useState, useEffect, useRef } from 'react';
import VoiceAssistant from './VoiceAssistant';

const examplePrompts = [
    "A modern portfolio for a travel photographer with a stunning gallery.",
    "A clean business website for a solar energy company.",
    "A wedding photography site with a gallery and booking form.",
    "A personal blog for a food critic with a minimalist, clean layout.",
    "A landing page for a new mobile app launch.",
];

const Spinner: React.FC = () => (
    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

interface AiWebsiteBuilderPageProps {
  onGenerate: (prompt: string) => Promise<{success: boolean, error?: string}>;
}

const FilePreview: React.FC<{ file: File, onRemove: () => void }> = ({ file, onRemove }) => {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [file]);

    return (
        <div className="relative bg-gray-700 p-2 rounded-lg flex items-center gap-2 text-xs text-white animate-fade-in-up">
            {preview ? (
                <img src={preview} alt={file.name} className="w-8 h-8 rounded object-cover" />
            ) : (
                 <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                 </div>
            )}
            <span className="truncate max-w-24">{file.name}</span>
            <button onClick={onRemove} className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors">&times;</button>
        </div>
    );
};


const AiWebsiteBuilderPage: React.FC<AiWebsiteBuilderPageProps> = ({ onGenerate }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeExampleIndex, setActiveExampleIndex] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveExampleIndex(prev => (prev + 1) % examplePrompts.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        setError(null);
        
        const result = await onGenerate(prompt);
        
        if (!result.success) {
            setError(result.error || "Designing your website with AI magic… Please wait.");
        }
        // On success, the App component handles navigation, so we don't need to set loading to false.
        // If it fails, we need to allow the user to try again.
        if (!result.success) {
            setIsLoading(false);
        }
    };

    const handleFileUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setUploadedFiles(prev => [...prev, ...Array.from(event.target.files!)]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex-1 flex flex-col p-4 md:p-8 text-white bg-gradient-to-b from-[#0f172a] to-[#1e293b] animate-fade-in min-h-screen items-center justify-center">
            <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png,image/jpeg,application/pdf"
            />
            <div className="w-full flex-1 flex flex-col items-center justify-center">
                <div className="text-center w-full max-w-4xl mx-auto">
                     <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-300 to-purple-400">
                       Design Smarter. Build Faster.
                    </h1>
                     <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-2">
                        Powered by Your Voice & Imagination.
                    </h2>
                    <p className="mt-6 text-lg text-gray-400 max-w-3xl mx-auto">
                        Just describe it — your AI Designer brings your ideas to life as stunning, functional websites.
                    </p>
                </div>

                <div className="mt-10 w-full max-w-3xl space-y-4">
                    <div className="bg-gray-800/50 p-3 rounded-2xl border border-gray-700 shadow-2xl shadow-black/20">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your website idea in detail..."
                            className="w-full bg-transparent p-3 focus:outline-none resize-none h-24 text-lg"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleGenerate();
                                }
                            }}
                        />
                        <div className="flex items-center justify-between gap-2 p-2 border-t border-gray-700">
                             <div className="flex items-center gap-1">
                                <button onClick={handleFileUploadClick} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors" title="Upload sketches, logos, or reference files (.png, .jpg, .pdf)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                </button>
                                 <VoiceAssistant onTranscript={setPrompt} />
                            </div>
                            <button 
                                onClick={handleGenerate} 
                                disabled={isLoading}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30"
                            >
                                {isLoading ? <><Spinner /> Designing...</> : '🎨 Generate Website'}
                            </button>
                        </div>
                    </div>

                    {uploadedFiles.length > 0 && (
                        <div className="p-3 bg-gray-800/30 border border-gray-700/50 rounded-lg">
                            <h4 className="text-xs font-semibold text-gray-400 mb-2">Attached Files:</h4>
                            <div className="flex flex-wrap gap-2">
                                {uploadedFiles.map((file, index) => (
                                    <FilePreview key={index} file={file} onRemove={() => handleRemoveFile(index)} />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="h-6 text-center text-gray-500 relative">
                        {examplePrompts.map((p, index) => (
                            <p key={index} className={`absolute inset-0 transition-opacity duration-700 ${index === activeExampleIndex ? 'opacity-100' : 'opacity-0'}`}>
                                Try: <span className="text-gray-400 cursor-pointer hover:underline" onClick={() => setPrompt(p)}>{p}</span>
                            </p>
                        ))}
                    </div>
                     {isLoading && (
                        <div className="text-center text-indigo-300 font-semibold animate-pulse">
                           Designing your website with AI magic… Please wait.
                        </div>
                    )}
                     {error && !isLoading && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
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
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AiWebsiteBuilderPage;