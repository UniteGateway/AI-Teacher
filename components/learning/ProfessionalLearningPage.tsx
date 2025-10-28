import React from 'react';
import { Page } from '../../types';

interface ProfessionalLearningPageProps {
  onNavigate: (page: Page) => void;
}

const Feature: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold text-purple-400">{title}</h3>
        <p className="mt-2 text-gray-300">{description}</p>
    </div>
);

const ProfessionalLearningPage: React.FC<ProfessionalLearningPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col items-center text-white animate-fade-in px-4">
        {/* Hero Section */}
        <section 
            className="relative w-full py-24 md:py-32 flex items-center justify-center text-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    AI for Professionals
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-200">
                    Stay ahead in your career. Upskill, learn new technologies, and master business concepts on your schedule.
                </p>
                <button
                    onClick={() => onNavigate(Page.LOGIN)}
                    className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-transform transform hover:scale-105"
                >
                    Advance Your Career
                </button>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 w-full max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Invest in Your Growth</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <Feature 
                    title="Coding & Tech Skills"
                    description="Learn Python, JavaScript, data science, or cloud computing. Our AI can act as your personal coding mentor, helping you build real projects."
                />
                <Feature 
                    title="Business & Management"
                    description="Sharpen your strategic thinking. Explore topics like marketing, finance, project management, and leadership with an AI business coach."
                />
                <Feature 
                    title="Language Learning"
                    description="Become fluent in a new language with a conversational AI partner that can practice with you anytime, correcting your grammar and pronunciation."
                />
                <Feature 
                    title="Certification Prep"
                    description="Prepare for industry certifications like PMP, AWS Certified Cloud Practitioner, and more with structured guidance and practice exams."
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

export default ProfessionalLearningPage;
