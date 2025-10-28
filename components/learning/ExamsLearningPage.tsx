import React from 'react';
import { Page } from '../../types';

interface ExamsLearningPageProps {
  onNavigate: (page: Page) => void;
}

const Feature: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 h-full">
        <h3 className="text-xl font-bold text-orange-400">{title}</h3>
        <p className="mt-2 text-gray-300">{description}</p>
    </div>
);

const ExamsLearningPage: React.FC<ExamsLearningPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col items-center text-white animate-fade-in px-4">
        {/* Hero Section */}
        <section 
            className="relative w-full py-24 md:py-32 flex items-center justify-center text-center"
            style={{ backgroundImage: `url('https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    AI for Govt Exams & Career
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-200">
                    Prepare smarter for government jobs, banking, civil services, and other competitive exams with your personal AI Teacher.
                </p>
                <button
                    onClick={() => onNavigate(Page.LOGIN)}
                    className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-transform transform hover:scale-105"
                >
                    Start AI Exam Preparation
                </button>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 w-full max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Your Edge in Competitive Exams</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Feature 
                    title="UPSC / Civil Services"
                    description="Tackle General Studies, CSAT, and practice essay writing with AI-driven feedback and structured learning modules."
                />
                <Feature 
                    title="Banking & SSC Prep"
                    description="Master Quantitative Aptitude, Reasoning, English, and General Awareness with unlimited practice questions and detailed solutions."
                />
                 <Feature 
                    title="State-Level Exams"
                    description="Customized modules for state-specific exams like APPSC and TSPSC, covering local GK and syllabus requirements."
                />
                <Feature 
                    title="AI Question Analysis"
                    description="Understand the 'why' behind every answer. Get detailed, step-by-step explanations for complex problems from your AI Teacher."
                />
                <Feature 
                    title="Voice-Based Revision"
                    description="Revise on the go! Just ask your AI Teacher to quiz you on specific topics through voice, making revision fast and efficient."
                />
                <Feature 
                    title="Interview Preparation"
                    description="Practice mock interviews with an AI that can simulate real interview scenarios and provide feedback on your answers and confidence."
                />
            </div>
        </section>
        
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

export default ExamsLearningPage;
