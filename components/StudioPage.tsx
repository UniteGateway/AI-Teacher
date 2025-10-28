import React, { useState, useEffect, useCallback, useRef } from 'react';
import { jsPDF } from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import VoiceAssistant from './VoiceAssistant';
import { AiTool } from '../types';

type StudioTab = 'image' | 'video' | 'character' | 'report';
type ImageStyle = 'Realistic' | 'Digital Art' | '3D' | 'Cartoon' | 'Infographic';
type VoiceStyle = 'Male' | 'Female' | 'Neutral' | 'Robotic';

interface StudioPageProps {
    onGenerateImage: (prompt: string) => Promise<string[]>;
    onGenerateVideo: (prompt: string, onProgress: (message: string) => void) => Promise<string>;
    onGenerateReport: (topic: string) => Promise<string>;
}

const websiteBuilderTools: AiTool[] = [
  { name: 'Nuro Web Designer', description: 'Create websites instantly with AI prompts.', thumbnailUrl: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800', iframeUrl: 'https://nuro.chat', embeddable: true },
  { name: 'Lovable', description: 'Turn ideas into real web apps using AI.', thumbnailUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800', iframeUrl: 'https://lovable.dev', embeddable: true },
  { name: 'Vercel v0', description: 'Generate production-ready web interfaces with AI.', thumbnailUrl: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800', iframeUrl: 'https://v0.dev', embeddable: true },
  { name: 'Replit AI', description: 'Code, deploy, and collaborate with an AI-powered IDE.', thumbnailUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800', iframeUrl: 'https://replit.com', embeddable: true },
  { name: 'Cursor AI', description: 'Build and edit code using conversational AI tools.', thumbnailUrl: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800', iframeUrl: 'https://cursor.sh', embeddable: false },
  { name: 'Uizard AI', description: 'Turn sketches and mockups into live UI prototypes.', thumbnailUrl: 'https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg?auto=compress&cs=tinysrgb&w=800', iframeUrl: 'https://uizard.io', embeddable: false },
];

const imageCreatorTools: AiTool[] = [
  { name: 'Midjourney', description: 'A leading platform for high-quality AI image generation.', thumbnailUrl: 'https://images.pexels.com/photos/1618606/pexels-photo-1618606.jpeg?auto=compress&cs=tinysrgb&w=800', iframeUrl: 'https://www.midjourney.com', embeddable: false },
  { name: 'Clipdrop (Stable Diffusion)', description: 'Create and edit images with the power of Stable Diffusion.', thumbnailUrl: 'https://images.pexels.com/photos/159821/color-structure-paint-canvas-159821.jpeg?auto=compress&cs=tinysrgb&w=800', iframeUrl: 'https://clipdrop.co/stable-diffusion', embeddable: true },
  { name: 'Leonardo.Ai', description: 'Generate stunning game assets, concept art, and more.', thumbnailUrl: 'https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg?auto=compress&cs=tinysrgb&w=800', iframeUrl: 'https://leonardo.ai', embeddable: false },
];

const learningPlatformTools: AiTool[] = [
    { name: 'Google Colab', description: 'Interactive Python notebooks for ML.', thumbnailUrl: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=800', iframeUrl: 'https://colab.research.google.com', embeddable: false },
    { name: 'Kaggle Learn', description: 'Data science courses.', thumbnailUrl: 'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg?auto=compress&cs=tinysrgb&w=800', iframeUrl: 'https://www.kaggle.com/learn', embeddable: false },
    { name: 'Hugging Face Spaces', description: 'Live AI demos & models.', thumbnailUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=800&auto=format=fit-crop', iframeUrl: 'https://huggingface.co/spaces', embeddable: true },
    { name: 'Teachable Machine', description: 'Train AI models easily.', thumbnailUrl: 'https://images.pexels.com/photos/7661245/pexels-photo-7661245.jpeg?auto=compress&cs=tinysrgb&w=800', iframeUrl: 'https://teachablemachine.withgoogle.com', embeddable: true },
    { name: 'Deepnote', description: 'Collaborative ML notebook.', thumbnailUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800', iframeUrl: 'https://deepnote.com', embeddable: false },
    { name: 'Open edX', description: 'AI + ML university courses.', thumbnailUrl: 'https://images.pexels.com/photos/4144223/pexels-photo-4144223.jpeg?auto=compress&cs=tinysrgb&w=800', iframeUrl: 'https://openedx.org', embeddable: false },
];

const watermarkSvg = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAxMDAgMjUiPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlsce0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgc3R5bGU9ImZpbGw6I2ZmZjtvcGFjaXR5OiAwLjciP051cm8gQUkgTGFiczwvdGV4dD48L3N2Zz4=';

const Spinner: React.FC<{ size?: string }> = ({ size = 'w-6 h-6' }) => (
    <div className={`${size} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
);

const TabButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 px-2 text-center font-semibold rounded-lg transition-all duration-300 text-xs shadow-inner ${
            isActive
                ? 'bg-indigo-600 text-white shadow-indigo-500/30'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const ToolCard: React.FC<{ tool: AiTool; onPreview: (tool: AiTool) => void; onLaunch: (url: string) => void; }> = ({ tool, onPreview, onLaunch }) => (
    <div className="group bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.03]">
        <div className="aspect-video overflow-hidden">
            <img loading="lazy" src={tool.thumbnailUrl} alt={tool.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-md font-bold text-white text-left">{tool.name}</h3>
            <p className="text-gray-400 mt-1 text-xs flex-grow text-left">{tool.description}</p>
            <div className="mt-4 flex items-center gap-2">
                <button onClick={() => onPreview(tool)} className="flex-1 text-xs bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-md transition-colors">Preview</button>
                <button onClick={() => onLaunch(tool.iframeUrl)} className="flex-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-md transition-colors">Launch</button>
            </div>
        </div>
    </div>
);

const PreviewModal: React.FC<{ tool: AiTool, onClose: () => void, onLaunch: (url: string) => void }> = ({ tool, onClose, onLaunch }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex-shrink-0 flex justify-between items-center bg-gray-800/50 p-3 rounded-t-lg">
                <h3 className="text-lg font-bold text-white">{tool.name}</h3>
                <button onClick={onClose} className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded-md">&times; Close</button>
            </div>
            {tool.embeddable ? (
                 <iframe 
                    key={tool.name}
                    src={tool.iframeUrl} 
                    className="w-full h-full border-0 bg-white"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    referrerPolicy="no-referrer"
                />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-cover bg-center" style={{backgroundImage: `url(${tool.thumbnailUrl})`}}>
                    <div className="bg-black/70 p-8 rounded-lg">
                         <h4 className="text-2xl font-bold text-white">This content can't be displayed here.</h4>
                         <p className="text-gray-300 mt-2">For the best experience, please open this tool in a new tab.</p>
                         <button onClick={() => onLaunch(tool.iframeUrl)} className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
                            Launch {tool.name}
                         </button>
                    </div>
                </div>
            )}
        </div>
    </div>
);

const ImagePreviewModal: React.FC<{ src: string, onClose: () => void }> = ({ src, onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
        <img src={src} alt="Generated art preview" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
        <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center text-lg">&times;</button>
    </div>
);

const ImageCard: React.FC<{
    src: string;
    index: number;
    isSuggestion: boolean;
    onPreview: () => void;
    onDownload: (format: 'jpg' | 'png') => void;
    onRegenerate: () => void;
}> = ({ src, index, isSuggestion, onPreview, onDownload, onRegenerate }) => {
    return (
        <div className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:scale-105">
            <img src={src} alt={`Art preview ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 group-hover:opacity-100 transition-opacity"></div>
             <p className="absolute bottom-2 left-3 text-white text-xs font-bold drop-shadow-md">{isSuggestion ? `Suggestion ${index + 1}` : `Generated Art ${index + 1}`}</p>

            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button onClick={onPreview} className="flex-1 h-10 bg-white/20 hover:bg-white/30 rounded-md text-white text-xs font-bold backdrop-blur-sm">🔍<span className="hidden sm:inline"> Preview</span></button>
                {!isSuggestion && (
                    <>
                        <div className="flex flex-col gap-1">
                             <button onClick={() => onDownload('jpg')} className="flex-1 h-5 px-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-xs font-bold backdrop-blur-sm">JPG</button>
                             <button onClick={() => onDownload('png')} className="flex-1 h-5 px-2 bg-white/20 hover:bg-white/30 rounded-md text-white text-xs font-bold backdrop-blur-sm">PNG</button>
                        </div>
                        <button onClick={onRegenerate} className="flex-1 h-10 bg-white/20 hover:bg-white/30 rounded-md text-white text-xs font-bold backdrop-blur-sm">🎨<span className="hidden sm:inline"> Similar</span></button>
                    </>
                )}
            </div>
        </div>
    );
};

const StudioPage: React.FC<StudioPageProps> = ({ onGenerateImage, onGenerateVideo, onGenerateReport }) => {
    const [activeTab, setActiveTab] = useState<StudioTab>('image');
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewTarget, setPreviewTarget] = useState<AiTool | null>(null);
    const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
    
    // Image state
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [suggestedImages, setSuggestedImages] = useState<string[]>([]);
    const [imageStyle, setImageStyle] = useState<ImageStyle>('Realistic');

    // Video state
    const [videoProgress, setVideoProgress] = useState('');
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [videoVoice, setVideoVoice] = useState<VoiceStyle>('Male');

    // Report state
    const [reportTopic, setReportTopic] = useState('');
    const [generatedReport, setGeneratedReport] = useState<string | null>(null);
    
    // Fix: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchSuggestedImages = useCallback(async (query: string) => {
        if (!query.trim() || !process.env.PEXELS_API_KEY) {
            setSuggestedImages([]);
            return;
        }
        try {
            const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=4`, {
                headers: { Authorization: process.env.PEXELS_API_KEY }
            });
            if (!response.ok) throw new Error('Failed to fetch suggestions.');
            const data = await response.json();
            setSuggestedImages(data.photos.map((p: any) => p.src.large));
        } catch (e) {
            console.error(e);
            setSuggestedImages([]);
        }
    }, []);

    const currentQuery = activeTab === 'report' ? reportTopic : prompt;
    useEffect(() => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            fetchSuggestedImages(currentQuery);
        }, 500);
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [currentQuery, fetchSuggestedImages]);

    const handleLaunch = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleGenerate = async (regeneratePrompt?: string) => {
        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);
        setGeneratedVideo(null);
        setGeneratedReport(null);
        
        try {
            const currentPrompt = regeneratePrompt || prompt;
            switch (activeTab) {
                case 'image':
                case 'character':
                    if (!currentPrompt.trim()) throw new Error("Please enter a prompt.");
                    const fullPrompt = activeTab === 'character' 
                        ? `A full character portrait of: ${currentPrompt}, ${imageStyle} style.`
                        : `${currentPrompt}, ${imageStyle} style.`;
                    const images = await onGenerateImage(fullPrompt);
                    if (images.length === 0) throw new Error("The AI failed to generate images. Please try a different prompt.");
                    setGeneratedImages(images);
                    break;
                case 'video':
                    if (!currentPrompt.trim()) throw new Error("Please enter a prompt.");
                    const videoUrl = await onGenerateVideo(currentPrompt, setVideoProgress);
                    setGeneratedVideo(videoUrl);
                    break;
                case 'report':
                    if (!reportTopic.trim()) throw new Error("Please enter a topic.");
                    const reportText = await onGenerateReport(reportTopic);
                    setGeneratedReport(reportText);
                    break;
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
            setVideoProgress('');
        }
    };
    
    const downloadImage = (base64Data: string, format: 'jpg' | 'png') => {
        const link = document.createElement('a');
        link.href = `data:image/${format};base64,${base64Data}`;
        link.download = `nuro-ai-studio-image.${format}`;
        link.click();
    };
    
    const downloadReportAsPdf = () => {
        if (!generatedReport) return;
        const doc = new jsPDF();
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.addImage(watermarkSvg, 'SVG', 10, doc.internal.pageSize.height - 15, 30, 7.5);
        doc.setFontSize(12);
        doc.setTextColor(40);
        const cleanText = generatedReport.replace(/#+\s?/g, '');
        const splitText = doc.splitTextToSize(cleanText, 180);
        doc.text(splitText, 10, 20);
        doc.save('nuro-ai-studio-report.pdf');
    };
    
    const downloadPresentation = () => {
        if (!generatedReport) return;
        let pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_WIDE';
        const sections = generatedReport.split('##').map(s => s.trim()).filter(Boolean);
        const titleMatch = sections[0].match(/#\s*(.*)/);
        const title = titleMatch ? titleMatch[1] : 'AI Generated Presentation';
        
        let titleSlide = pptx.addSlide();
        titleSlide.addText(title, { x: 0.5, y: 2.5, w: '90%', h: 1, fontSize: 44, bold: true, align: 'center', color: '363636' });
        titleSlide.addText("Generated by Nuro AI Studio", { x: 0.5, y: 3.5, w: '90%', h: 0.5, fontSize: 18, align: 'center', color: '808080' });

        sections.forEach(section => {
             const lines = section.split('\n').map(l => l.trim()).filter(Boolean);
             const heading = lines.shift() || 'Slide';
             let contentSlide = pptx.addSlide();
             contentSlide.addText(heading, { x: 0.5, y: 0.5, w: '90%', h: 1, fontSize: 28, bold: true, color: '363636' });
             contentSlide.addText(lines.join('\n'), { x: 0.5, y: 1.5, w: '90%', h: 3.5, fontSize: 18, bullet: {type: 'dot', indent: 20}, color: '494949' });
        });
        pptx.writeFile({ fileName: 'nuro-ai-studio-presentation.pptx' });
    };

    const renderWorkspace = () => {
        if (isLoading) {
            return (
                <div className="m-auto text-center">
                    <Spinner size="w-12 h-12"/>
                    {activeTab === 'video' && <p className="mt-4 text-white font-semibold">{videoProgress || 'Generating...'}</p>}
                </div>
            );
        }

        if (error) {
            return <p className="m-auto text-red-400 text-center max-w-sm">{error}</p>;
        }
        
        const imagesToDisplay = generatedImages.length > 0 ? generatedImages : suggestedImages;
        const isSuggestion = generatedImages.length === 0 && suggestedImages.length > 0;
        
        if ((activeTab === 'image' || activeTab === 'character' || ( (activeTab === 'video' || activeTab === 'report') && !generatedVideo && !generatedReport)) && imagesToDisplay.length > 0) {
            return (
                <div className="grid grid-cols-2 gap-4 animate-fade-in w-full h-full">
                     {imagesToDisplay.map((imgData, i) => (
                        <ImageCard 
                            key={i}
                            index={i}
                            src={imgData.startsWith('data:') || imgData.startsWith('http') ? imgData : `data:image/png;base64,${imgData}`}
                            isSuggestion={isSuggestion}
                            onPreview={() => setModalImageSrc(imgData.startsWith('data:') || imgData.startsWith('http') ? imgData : `data:image/png;base64,${imgData}`)}
                            onDownload={(format) => downloadImage(imgData, format)}
                            onRegenerate={() => handleGenerate(`${prompt}, similar style`)}
                        />
                     ))}
                </div>
            );
        }

        switch(activeTab) {
            case 'video':
                 return generatedVideo ? (
                    <video src={generatedVideo} controls autoPlay className="max-w-full max-h-full rounded-md animate-fade-in" />
                ) : (
                    <div className="m-auto text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto opacity-50"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
                        <p className="mt-4">Your generated video will appear here.</p>
                        <p className="text-xs mt-1">Note: Video generation can take several minutes.</p>
                    </div>
                );
            case 'report':
                 return generatedReport ? (
                    <div className="w-full h-full flex flex-col animate-fade-in">
                        <div className="flex justify-end gap-2 mb-2 flex-shrink-0">
                            <button onClick={downloadReportAsPdf} className="text-xs bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-full">Download PDF</button>
                            <button onClick={downloadPresentation} className="text-xs bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-full">Download PPT</button>
                        </div>
                        <div className="overflow-y-auto p-4 bg-gray-900/50 rounded-md prose prose-invert max-w-none flex-grow">
                            {generatedReport.split('\n').map((line, i) => {
                                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold">{line.substring(2)}</h1>;
                                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-4">{line.substring(3)}</h2>;
                                return <p key={i}>{line}</p>;
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="m-auto text-center text-gray-500">
                         <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto opacity-50"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <p className="mt-4">Your generated report will appear here.</p>
                    </div>
                );
            default:
                 return (
                    <div className="m-auto text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto opacity-50"><path d="M21.5 12c0-1.7-1-3.2-2.5-4L12 3 4.5 8C3 9.2 2 11.2 2 13.3c0 2.8 2 5.2 4.7 5.2H12c2.8 0 5-2.2 5-5s-2.2-5-5-5H2.5"/><path d="m18 12.5 3.5-3.5L18 5.5"/></svg>
                        <p className="mt-4">Your creations will appear here.</p>
                    </div>
                 );
        }
    };
    
    return (
        <div className="flex-1 flex flex-col p-4 md:p-8 text-white animate-fade-in bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
             {previewTarget && <PreviewModal tool={previewTarget} onClose={() => setPreviewTarget(null)} onLaunch={handleLaunch} />}
             {modalImageSrc && <ImagePreviewModal src={modalImageSrc} onClose={() => setModalImageSrc(null)} />}

            <div className="text-center w-full max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                    Welcome to <span className="text-indigo-400">AI Studio</span>
                </h1>
                <p className="mt-6 text-lg text-gray-400">
                   Create anything you imagine. Generate AI-powered images, videos, characters, presentations, and reports — all in one place.
                </p>
            </div>
            
            <div className="mt-10 w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Center: Workspace */}
                <div className="lg:col-span-2 bg-gray-800/70 border border-gray-700/50 rounded-2xl p-4 flex flex-col gap-4 min-h-[60vh] relative overflow-hidden shadow-2xl shadow-black/20">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-[0.03]" 
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1420&auto=format=fit=crop')` }}
                    ></div>
                    <div className="absolute -inset-1/2 bg-gradient-to-r from-purple-600/10 via-cyan-500/10 to-indigo-600/10 animate-slow-spin"></div>
                    <div className="relative flex-1 flex items-center justify-center">
                        {renderWorkspace()}
                    </div>
                </div>
                
                {/* Right: Controls */}
                <div className="w-full lg:col-span-1 flex-shrink-0 bg-gray-800/50 border border-gray-700 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-2 bg-gray-900/50 p-1 rounded-lg">
                        <TabButton icon={<>🖼️</>} label="Image" isActive={activeTab === 'image'} onClick={() => setActiveTab('image')} />
                        <TabButton icon={<>🎬</>} label="Video" isActive={activeTab === 'video'} onClick={() => setActiveTab('video')} />
                        <TabButton icon={<>👤</>} label="Character" isActive={activeTab === 'character'} onClick={() => setActiveTab('character')} />
                        <TabButton icon={<>📑</>} label="Report" isActive={activeTab === 'report'} onClick={() => setActiveTab('report')} />
                    </div>
                    
                    <div className="flex-grow space-y-3">
                         {(activeTab === 'image' || activeTab === 'character') && (
                            <>
                                <h4 className="text-sm font-semibold text-gray-400">Style Preset</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(['Realistic', 'Digital Art', '3D', 'Cartoon', 'Infographic'] as ImageStyle[]).map(s => (
                                        <button key={s} onClick={() => setImageStyle(s)} className={`px-3 py-1 text-xs rounded-full ${imageStyle === s ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{s}</button>
                                    ))}
                                </div>
                            </>
                         )}

                        {activeTab === 'video' && (
                             <>
                                <h4 className="text-sm font-semibold text-gray-400">Voice Style</h4>
                                <select value={videoVoice} onChange={e => setVideoVoice(e.target.value as VoiceStyle)} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Neutral</option>
                                    <option>Robotic</option>
                                </select>
                            </>
                        )}

                        <textarea
                            value={activeTab === 'report' ? reportTopic : prompt}
                            onChange={e => {
                                if (activeTab === 'report') setReportTopic(e.target.value);
                                else setPrompt(e.target.value);
                            }}
                            placeholder={
                                activeTab === 'report' ? "What's your project about?" :
                                activeTab === 'character' ? "e.g., A space explorer girl..." :
                                activeTab === 'video' ? "Describe your video idea..." :
                                "e.g., Solar energy poster..."
                            }
                            rows={4}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>

                    <button onClick={() => handleGenerate()} disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-110 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 transform hover:scale-105">
                        {isLoading ? <Spinner /> : 'Generate'}
                    </button>
                     {error && !isLoading && <p className="text-red-400 text-xs text-center">{error}</p>}
                     <div className="mt-auto">
                        <VoiceAssistant onTranscript={(t) => {
                            if (activeTab === 'report') setReportTopic(t);
                            else setPrompt(t);
                        }} />
                     </div>
                </div>
            </div>

            <hr className="my-12 border-gray-700" />

            <div className="w-full max-w-7xl mx-auto">
                <div className="mt-10">
                    <h3 className="text-3xl font-bold mb-6">🚀 Learn with Global AI Platforms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {learningPlatformTools.map(tool => <ToolCard key={tool.name} tool={tool} onPreview={setPreviewTarget} onLaunch={handleLaunch} />)}
                    </div>
                </div>

                <div className="mt-12">
                    <h3 className="text-3xl font-bold mb-6">Build Websites with AI – Instantly</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {websiteBuilderTools.map(tool => <ToolCard key={tool.name} tool={tool} onPreview={setPreviewTarget} onLaunch={handleLaunch} />)}
                    </div>
                </div>

                 <div className="mt-12">
                    <h3 className="text-3xl font-bold mb-6">Explore AI Image Creators</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {imageCreatorTools.map(tool => <ToolCard key={tool.name} tool={tool} onPreview={setPreviewTarget} onLaunch={handleLaunch} />)}
                    </div>
                </div>
            </div>

            <style>{`
            .prose { line-height: 1.6; }
            .prose h1, .prose h2, .prose p { margin-bottom: 0.5em; }
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
            @keyframes slow-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .animate-slow-spin { animation: slow-spin 20s linear infinite; }
            `}</style>
        </div>
    );
};

export default StudioPage;
