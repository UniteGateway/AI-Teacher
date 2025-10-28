import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Teacher, DrawingCommand, ContentPart, Shape } from '../types';
import TeacherAvatarDisplay from './TeacherAvatar';

interface BlackboardProps {
  content: string;
  teacher: Teacher;
  videoUrl: string | null;
  youtubeEmbedUrl: string | null;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  isTyping: boolean;
}

const TAILWIND_COLOR_MAP: Record<string, string> = {
  'blue-300': '#93c5fd', 'blue-400': '#60a5fa',
  'purple-300': '#d8b4fe', 'purple-400': '#c084fc',
  'orange-300': '#fdba74', 'orange-400': '#fb923c',
  'yellow-300': '#fde047', 'yellow-400': '#facc15',
  'green-300': '#86efac', 'green-400': '#4ade80',
  'red-300': '#fca5a5', 'red-400': '#f87171',
  'white': '#FFFFFF',
};

const parseAIResponse = (text: string): { contentParts: ContentPart[], drawingCommands: DrawingCommand[] } => {
    const drawingCommands: DrawingCommand[] = [];
    let processedText = text;

    // Regex for drawing commands: [DRAW:SHAPE color=color-name x=10 y=10 ...]
    const drawRegex = /\[DRAW:(\w+)\s+([^\]]+)\]/g;
    processedText = processedText.replace(drawRegex, (_, shape, paramsStr) => {
        try {
            const params: { [key: string]: number } = {};
            const colorRegex = /color=([\w-]+)/;
            const colorMatch = paramsStr.match(colorRegex);
            const color = colorMatch ? colorMatch[1] : 'white';

            paramsStr.replace(colorRegex, '').trim().split(/\s+/).forEach((p: string) => {
                const [key, value] = p.split('=');
                if (key && value) params[key] = parseFloat(value);
            });

            if (shape && Object.keys(params).length > 0) {
                 drawingCommands.push({
                    shape: shape.toUpperCase() as Shape,
                    color: color,
                    params: params
                });
            }
        } catch (e) {
            console.error("Failed to parse drawing command:", shape, paramsStr, e);
        }
        return ''; // Remove command from text
    }).trim();

    // Regex for highlighting: [HIGHLIGHT:text to highlight]
    const highlightRegex = /\[HIGHLIGHT:([^\]]+)\]/g;
    const contentParts: ContentPart[] = [];
    
    processedText.split(highlightRegex).forEach((part, i) => {
        if (i % 2 === 0) { // This is regular text
            if (part) contentParts.push({ type: 'text', value: part });
        } else { // This is highlighted text
            contentParts.push({ type: 'highlight', value: part });
        }
    });

    return { contentParts, drawingCommands };
};


const Blackboard: React.FC<BlackboardProps> = ({ content, teacher, videoUrl, youtubeEmbedUrl, isMaximized, onToggleMaximize, isTyping }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [animatedContent, setAnimatedContent] = useState('');

  // Effect for typing animation
  useEffect(() => {
    setAnimatedContent('');
    if (isTyping || videoUrl || youtubeEmbedUrl) {
      setAnimatedContent(content);
      return;
    }
    
    let i = 0;
    const timer = setInterval(() => {
      setAnimatedContent(prev => prev + content.charAt(i));
      i++;
      if (i >= content.length) {
        clearInterval(timer);
      }
    }, 30); // Adjust typing speed here

    return () => clearInterval(timer);
  }, [content, isTyping, videoUrl, youtubeEmbedUrl]);


  const { contentParts, drawingCommands } = useMemo(() => {
    if (videoUrl || youtubeEmbedUrl) {
      return { contentParts: [{ type: 'text' as 'text', value: '' }], drawingCommands: [] };
    }
    return parseAIResponse(animatedContent);
  }, [animatedContent, videoUrl, youtubeEmbedUrl]);
  
  // Effect for handling canvas resizing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0];
        if (entry) {
            setDimensions({
                width: entry.contentRect.width,
                height: entry.contentRect.height
            });
        }
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Effect for drawing on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dimensions.width || !dimensions.height) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    if (videoUrl || youtubeEmbedUrl) return;

    // Draw each command
    drawingCommands.forEach(cmd => {
        const color = TAILWIND_COLOR_MAP[cmd.color] || '#FFFFFF';
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;
        ctx.shadowColor = color;
        ctx.shadowBlur = 5;
        
        const p = cmd.params;
        const w = dimensions.width;
        const h = dimensions.height;
        
        ctx.beginPath();
        switch(cmd.shape) {
            case 'RECT':
                if (p.x && p.y && p.w && p.h) {
                    ctx.strokeRect(p.x/100 * w, p.y/100 * h, p.w/100 * w, p.h/100 * h);
                }
                break;
            case 'CIRCLE':
                if (p.x && p.y && p.r) {
                    ctx.arc(p.x/100 * w, p.y/100 * h, p.r/100 * w, 0, 2 * Math.PI);
                    ctx.stroke();
                }
                break;
            case 'LINE':
                if (p.x1 && p.y1 && p.x2 && p.y2) {
                    ctx.moveTo(p.x1/100 * w, p.y1/100 * h);
                    ctx.lineTo(p.x2/100 * w, p.y2/100 * h);
                    ctx.stroke();
                }
                break;
        }
        // Reset shadow for next drawing
        ctx.shadowBlur = 0;
    });

  }, [drawingCommands, dimensions, videoUrl, youtubeEmbedUrl]);


  const blackboardClasses = isMaximized 
    ? "fixed inset-0 z-40 bg-[#2a3a2a] border-0 rounded-none p-6 flex flex-col"
    : "bg-[#2a3a2a] border-8 border-[#5d4037] rounded-lg p-6 shadow-2xl flex-1 w-full relative overflow-hidden flex flex-col";

  return (
    <div ref={containerRef} className={`${blackboardClasses} chalkboard-texture`}>
        <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="absolute top-0 left-0 pointer-events-none"
        />
        <div className="absolute top-4 right-4 z-50 flex gap-2">
            {!isMaximized && (
                <div className="flex items-center gap-2 bg-black/20 p-2 rounded-full">
                    <TeacherAvatarDisplay teacher={teacher} className="w-8 h-8 rounded-full"/>
                    <span className="text-white font-semibold pr-2 hidden md:inline">{teacher.name}</span>
                </div>
            )}
            <button onClick={onToggleMaximize} className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors" title={isMaximized ? 'Minimize' : 'Enlarge'}>
                {isMaximized ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                }
            </button>
        </div>
        
        {youtubeEmbedUrl || videoUrl ? (
            <div className="absolute inset-0">
                {youtubeEmbedUrl && (
                    <div className="w-full h-full bg-black">
                        <iframe
                            key={youtubeEmbedUrl}
                            className="w-full h-full border-0"
                            src={`${youtubeEmbedUrl}&autoplay=1`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
                {videoUrl && !youtubeEmbedUrl && (
                    <>
                        <video
                            key={videoUrl}
                            src={videoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                    </>
                )}
            </div>
        ) : (
            <>
                <div className="absolute top-2 left-2 right-2 h-1 bg-black/10"></div>
                <div className="absolute bottom-2 left-2 right-2 h-1 bg-black/10"></div>
                <h3 className={`font-chalk text-2xl text-${teacher.color}-300 mb-4 border-b-2 border-${teacher.color}-300/30 pb-2 flex-shrink-0 pt-12`}>Nuro's Notes</h3>
                <div className="overflow-y-auto flex-1 relative z-10">
                    <p className="font-chalk text-3xl text-white leading-relaxed whitespace-pre-wrap min-h-[1em]">
                        {contentParts.map((part, index) => 
                            part.type === 'highlight' ? (
                                <span key={index} className="bg-yellow-300/30 text-yellow-200 px-1 rounded">
                                    {part.value}
                                </span>
                            ) : (
                                <span key={index}>{part.value}</span>
                            )
                        )}
                        {!isTyping && animatedContent.length === content.length && <span className="animate-pulse">_</span>}
                    </p>
                </div>
            </>
        )}
        <style>{`
            .chalkboard-texture {
                position: relative;
            }
            .chalkboard-texture::before {
                content: "";
                position: absolute;
                inset: 0;
                background-image: linear-gradient(45deg, rgba(255,255,255,0.01) 25%, transparent 25%),
                                  linear-gradient(-45deg, rgba(255,255,255,0.01) 25%, transparent 25%),
                                  linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.01) 75%),
                                  linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.01) 75%);
                background-size: 2px 2px;
                opacity: 0.5;
                pointer-events: none;
            }
        `}</style>
    </div>
  );
};

export default Blackboard;