import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Teacher, User, UserRole, Page, Session, TranscriptEntry, Currency } from './types';
import { getTeachers, getUsers, getSessionsForUser, saveSessionForUser } from './supabaseClient';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import HistorySidebar from './components/HistorySidebar';
import StudentDashboard from './components/StudentDashboard';
import ManagementDashboard from './components/ManagementDashboard';
import AdvertiserDashboard from './components/AdvertiserDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ContactModal from './components/ContactModal';
import PricingPage from './components/PricingPage';
import ContactSalesPage from './components/ContactSalesPage';
import AiTeacherLandingPage from './components/LiveClassPage';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ProfilePage from './components/ProfilePage';
import NuroChatPage from './components/NuroChatPage';
import AiWebsiteBuilderPage from './components/AiWebsiteBuilderPage';
import AiDesignPreviewPage from './components/AiDesignPreviewPage';
import StudioPage from './components/StudioPage';
import SchoolsLearningPage from './components/learning/SchoolsLearningPage';
import CollegeLearningPage from './components/learning/CollegeLearningPage';
import ExamsLearningPage from './components/learning/ExamsLearningPage';
import WatchDemoPage from './components/WatchDemoPage';
import TeacherSelection from './components/TeacherSelection';


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [users, setUsers] = useState<Record<UserRole, User> | null>(null);
  const [isHistorySidebarCollapsed, setIsHistorySidebarCollapsed] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const [currency, setCurrency] = useState<Currency>({ code: 'USD', symbol: '$' });
  const [searchQuery, setSearchQuery] = useState('');

  // New state for student chat management
  const [activeChat, setActiveChat] = useState<{ teacher: Teacher; transcript: TranscriptEntry[] } | null>(null);
  const [viewingSession, setViewingSession] = useState<Session | null>(null);

  // State for AI Website Builder
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [currentWebsitePrompt, setCurrentWebsitePrompt] = useState<string>('');

  const [ai, setAi] = useState<GoogleGenAI | null>(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchData = async () => {
      const fetchedTeachers = await getTeachers();
      setTeachers(fetchedTeachers);
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };

    fetchData();
    
    try {
      if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        return;
      }
      setAi(new GoogleGenAI({ apiKey: process.env.API_KEY }));
    } catch (error) {
        console.error("Failed to initialize GoogleGenAI:", error);
    }
  }, []);
  
  // Load session history when user logs in
  useEffect(() => {
    const fetchHistory = async () => {
        if (currentUser && currentUser.role === UserRole.STUDENT) {
            const history = await getSessionsForUser(currentUser.id);
            setSessionHistory(history);
        }
    };
    fetchHistory();
  }, [currentUser]);


  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  const handleLogin = (role: UserRole) => {
    if (users) {
        setCurrentUser(users[role]);
        handleNavigation(Page.DASHBOARD);
    }
  };

  const handleLogout = () => {
    if (activeChat && currentUser) {
        archiveSession(activeChat.transcript, activeChat.teacher);
    }
    setCurrentUser(null);
    setSessionHistory([]);
    setSearchQuery('');
    setActiveChat(null);
    setViewingSession(null);
    handleNavigation(Page.HOME);
  };
  
  const handleUpdateTeacher = (updatedTeacher: Teacher) => {
    setTeachers(prevTeachers => 
        prevTeachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t)
    );
  };

  const handleUpdateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const archiveSession = useCallback((transcript: TranscriptEntry[], teacher: Teacher) => {
    if (transcript.length > 1 && currentUser) { // Only save sessions with more than just an initial greeting
        const newSession: Session = {
            id: `session-${Date.now()}`,
            teacherName: teacher.name,
            teacherAvatar: teacher.avatar,
            teacherAvatarUrl: teacher.avatarUrl,
            teacherColor: teacher.color,
            date: new Date().toLocaleString(),
            transcript: transcript,
            voice: teacher.voice,
            availableVoices: teacher.availableVoices,
        };
        saveSessionForUser(currentUser.id, newSession);
        setSessionHistory(prev => [newSession, ...prev]);
    }
  }, [currentUser]);
  
  // --- Student Chat Handlers ---
  const handleNewChat = useCallback(() => {
      if (activeChat) {
          archiveSession(activeChat.transcript, activeChat.teacher);
      }
      setActiveChat(null);
      setViewingSession(null);
  }, [activeChat, archiveSession]);

  const handleStartChatWithTeacher = useCallback((teacher: Teacher) => {
      if (activeChat) {
          archiveSession(activeChat.transcript, activeChat.teacher);
      }
      setActiveChat({ teacher, transcript: [] });
      setViewingSession(null);
  }, [activeChat, archiveSession]);

  const handleViewSession = useCallback((session: Session) => {
      if (activeChat) {
          archiveSession(activeChat.transcript, activeChat.teacher);
      }
      setActiveChat(null);
      setViewingSession(session);
  }, [activeChat, archiveSession]);

  const handleUpdateActiveTranscript = (transcript: TranscriptEntry[]) => {
      if(activeChat) {
        setActiveChat(prev => prev ? { ...prev, transcript } : null);
      }
  };


  const handleGenerateWebsite = useCallback(async (prompt: string): Promise<{success: boolean, error?: string}> => {
    if (!ai) return { success: false, error: 'AI not initialized.' };
    
    setCurrentWebsitePrompt(prompt);
    setGeneratedHtml(null);

    try {
        const fullPrompt = `
            You are a world-class web designer and developer. Based on the following user prompt, generate a complete, single-file HTML website.
            The website should be visually stunning, fully responsive, and modern.
            Use Tailwind CSS for styling by including the official Tailwind CDN script in the <head>. You MUST include this script: <script src="https://cdn.tailwindcss.com"></script>.
            The HTML should be complete, starting with <!DOCTYPE html> and ending with </html>.
            Use high-quality, relevant placeholder images from Unsplash (https://source.unsplash.com/random/1600x900?{query}).
            Generate rich content, including sections like a navigation bar, a hero section, feature blocks, a gallery, a contact form, and a footer where appropriate.
            Do NOT include any explanations, markdown formatting, or anything other than the pure HTML code in your response. The output must be ONLY the HTML code itself.

            User Prompt: "${prompt}"
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: fullPrompt,
        });
        
        let htmlContent = response.text;
        const codeBlockRegex = /```(?:html)?\s*([\s\S]*?)\s*```/;
        const match = htmlContent.match(codeBlockRegex);
        if (match) {
            htmlContent = match[1].trim();
        }

        setGeneratedHtml(htmlContent);
        handleNavigation(Page.AI_DESIGN_PREVIEW);
        return { success: true };

    } catch (e) {
        console.error("Error generating website:", e);
        const errorMsg = "Sorry, something went wrong. The AI may be experiencing high demand. Please try a different prompt or try again later.";
        return { success: false, error: errorMsg };
    }
  }, [ai]);

  // --- MOCKED STUDIO API HANDLERS ---
  const handleGenerateImage = useCallback(async (prompt: string): Promise<string[]> => {
      if (!ai) throw new Error('AI not initialized.');
      
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: prompt }] },
          config: { responseModalities: [Modality.IMAGE] },
      });
      
      const images: string[] = [];
      for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
              images.push(part.inlineData.data);
          }
      }
      return images;
  }, [ai]);

  const handleGenerateVideo = useCallback(async (prompt: string, onProgress: (message: string) => void): Promise<string> => {
      if (!ai) throw new Error('AI not initialized.');
      if (!process.env.API_KEY) throw new Error("API key is not configured.");

      const progressMessages = [ "Scripting your educational short...", "Gathering visual concepts...", "Rendering the first few frames...", "Applying visual effects...", "Finalizing the render..."];
      let messageIndex = 0;
      const interval = setInterval(() => {
          onProgress(progressMessages[messageIndex]);
          messageIndex = (messageIndex + 1) % progressMessages.length;
      }, 5000);

      try {
          let operation = await ai.models.generateVideos({
              model: 'veo-3.1-fast-generate-preview',
              prompt: `A short, 10-second educational video about: ${prompt}`,
              config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
          });

          while (!operation.done) {
              await new Promise(resolve => setTimeout(resolve, 10000));
              operation = await ai.operations.getVideosOperation({ operation: operation });
          }

          const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
          if (!downloadLink) throw new Error('Video generation finished but no link was provided.');
          
          onProgress("Downloading video...");
          const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
          if (!response.ok) throw new Error('Failed to download the generated video.');
          
          const videoBlob = await response.blob();
          return URL.createObjectURL(videoBlob);
      } finally {
          clearInterval(interval);
      }
  }, [ai]);

  const handleGenerateReport = useCallback(async (topic: string): Promise<string> => {
      if (!ai) throw new Error('AI not initialized.');
      
      const fullPrompt = `Generate a concise, well-structured project report for a student on the topic: "${topic}". The report should be about 300 words, written in clear, accessible language. Structure it with a title, a brief introduction, 2-3 main body paragraphs with headings, and a short conclusion. Use Markdown for formatting (e.g., # for title, ## for headings, * for italics).`;
      
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: fullPrompt,
      });
      return response.text;
  }, [ai]);


  const renderCurrentPage = () => {
    // Handle all pages, regardless of login state first
    switch (currentPage) {
        case Page.PRICING:
            return <PricingPage currency={currency}/>;
        case Page.AI_WEBSITE_BUILDER:
            return <AiWebsiteBuilderPage onGenerate={handleGenerateWebsite} />;
        case Page.AI_DESIGN_PREVIEW:
             return <AiDesignPreviewPage 
                        generatedHtml={generatedHtml}
                        prompt={currentWebsitePrompt}
                        onNavigate={handleNavigation}
                        onRegenerate={handleGenerateWebsite}
                    />;
        case Page.CONTACT_SALES:
            return <ContactSalesPage onNavigate={handleNavigation} />;
        case Page.ABOUT:
            return <AboutPage />;
        case Page.STUDIO:
             return <StudioPage 
                onGenerateImage={handleGenerateImage}
                onGenerateVideo={handleGenerateVideo}
                onGenerateReport={handleGenerateReport}
             />;
        case Page.NURO_CHAT:
            return <NuroChatPage onNavigate={handleNavigation} />;
        case Page.WATCH_DEMO:
            return <WatchDemoPage onNavigate={handleNavigation} />;
        case Page.LEARNING_SCHOOLS:
            return <SchoolsLearningPage onNavigate={handleNavigation} />;
        case Page.LEARNING_COLLEGE:
            return <CollegeLearningPage onNavigate={handleNavigation} />;
        case Page.LEARNING_EXAMS:
            return <ExamsLearningPage onNavigate={handleNavigation} />;
        case Page.LIVE_CLASS:
            if (!currentUser) {
                return <AiTeacherLandingPage onNavigate={handleNavigation} />;
            }
            if (!ai) return <div className="flex-1 flex items-center justify-center"><p>Initializing AI...</p></div>;
            return renderDashboard();
    }

    if (!currentUser) {
        switch (currentPage) {
            case Page.LOGIN:
                return <Login onLogin={handleLogin} />;
            case Page.HOME:
            default:
                return <HomePage onNavigate={handleNavigation} />;
        }
    }
    
    // Pages for logged-in users
    switch (currentPage) {
        case Page.PROFILE:
            return <ProfilePage user={currentUser} onUpdateUser={handleUpdateCurrentUser} />;
        case Page.DASHBOARD:
        default:
            return renderDashboard();
    }
  }

  const renderDashboard = () => {
    if (!currentUser) return null;

    if (currentUser.role === UserRole.STUDENT) {
        if (!ai) return <div className="flex-1 flex items-center justify-center"><p>Initializing AI...</p></div>;
        
        let dashboardContent;
        if (viewingSession) {
            dashboardContent = (
                <StudentDashboard
                    key={viewingSession.id}
                    ai={ai}
                    currentUser={currentUser}
                    initialSessionData={viewingSession}
                    isReadOnly={true}
                    onUpdateTranscript={() => {}} // No updates in read-only mode
                    onSessionEnd={() => {}}
                />
            );
        } else if (activeChat) {
             dashboardContent = (
                <StudentDashboard
                    key={activeChat.teacher.id}
                    ai={ai}
                    currentUser={currentUser}
                    selectedTeacher={activeChat.teacher}
                    isReadOnly={false}
                    initialSessionData={{...activeChat, id: `active-${activeChat.teacher.id}`}}
                    onUpdateTranscript={handleUpdateActiveTranscript}
                    onSessionEnd={(transcript) => archiveSession(transcript, activeChat.teacher)}
                />
            );
        } else {
            dashboardContent = <TeacherSelection teachers={filteredTeachers} onSelectTeacher={handleStartChatWithTeacher} />;
        }

        return (
             <div className="flex flex-1 overflow-hidden">
                <HistorySidebar
                    sessions={sessionHistory}
                    onSelectSession={handleViewSession}
                    onNewChat={handleNewChat}
                    isCollapsed={isHistorySidebarCollapsed}
                    onToggle={() => setIsHistorySidebarCollapsed(prev => !prev)}
                />
                <main className={`flex-1 transition-all duration-300 ease-in-out flex flex-col ${isHistorySidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
                    {dashboardContent}
                </main>
            </div>
        );
    }

    // Dashboards for other roles
    const dashboardContent = () => {
        switch(currentUser.role) {
            case UserRole.TEACHER:
                return <TeacherDashboard teacher={currentUser} currency={currency} />;
            case UserRole.MANAGEMENT:
                return <ManagementDashboard teachers={teachers} onUpdateTeacher={handleUpdateTeacher} />;
            case UserRole.ADVERTISER:
                return <AdvertiserDashboard />;
            default:
                return null;
        }
    }
     return (
        <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 flex flex-col">
                {dashboardContent()}
            </main>
        </div>
    );
  }
  
  const footerMargin = currentUser?.role === UserRole.STUDENT 
    ? (isHistorySidebarCollapsed ? 'ml-20' : 'ml-80') 
    : 'ml-0';

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-[#1e2b4d] text-gray-100 flex flex-col font-sans">
        {isContactModalOpen && <ContactModal onClose={() => setIsContactModalOpen(false)} />}

        <Header 
            currentUser={currentUser} 
            currentPage={currentPage}
            searchQuery={searchQuery}
            onNavigate={handleNavigation}
            onLogout={handleLogout}
            onContact={() => setIsContactModalOpen(true)}
            onSearchChange={setSearchQuery}
            currency={currency}
        />
      
        <div className="flex-1 flex flex-col pt-16">
            {renderCurrentPage()}
        </div>
      
      <div className={`transition-all duration-300 ease-in-out ${footerMargin}`}>
         <Footer currency={currency} onCurrencyChange={setCurrency} onNavigate={handleNavigation} />
      </div>
    </div>
  );
};

export default App;
