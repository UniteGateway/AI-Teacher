import React from 'react';
import { Page } from '../../types';

interface HigherEdLearningPageProps {
  onNavigate: (page: Page) => void;
}

const Feature: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold text-blue-400">{title}</h3>
        <p className="mt-2 text-gray-300">{description}</p>
    </div>
);

const HigherEdLearningPage: React.FC<HigherEdLearningPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col items-center text-white animate-fade-in px-4">
        {/* Hero Section */}
        <section 
            className="relative w-full py-24 md:py-32 flex items-center justify-center text-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    AI for Higher Education
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-200">
                    Excel in your university courses. From complex theories to research assistance, our AI is your academic partner.
                </p>
                <button
                    onClick={() => onNavigate(Page.LOGIN)}
                    className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-transform transform hover:scale-105"
                >
                    Get Started Now
                </button>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 w-full max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Achieve Academic Excellence</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <Feature 
                    title="Advanced Topic Deep Dives"
                    description="Grasp complex subjects like quantum mechanics, organic chemistry, or economic theory with an AI that can break down intricate concepts."
                />
                <Feature 
                    title="Research & Writing Assistant"
                    description="Brainstorm ideas, organize your thesis, and get feedback on your essays. Streamline your research process from start to finish."
                />
                <Feature 
                    title="Code Debugging & Explanation"
                    description="For STEM students, our AI can help debug code, explain algorithms, and walk you through complex data structures."
                />
                <Feature 
                    title="Graduate Exam Preparation"
                    description="Prepare for the GRE, GMAT, MCAT, and more with tailored study plans, practice questions, and performance analytics."
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

export default HigherEdLearningPage;
