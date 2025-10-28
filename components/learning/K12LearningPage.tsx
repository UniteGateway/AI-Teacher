import React from 'react';
import { Page } from '../../types';

interface K12LearningPageProps {
  onNavigate: (page: Page) => void;
}

const Feature: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold text-green-400">{title}</h3>
        <p className="mt-2 text-gray-300">{description}</p>
    </div>
);

const K12LearningPage: React.FC<K12LearningPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col items-center text-white animate-fade-in px-4">
        {/* Hero Section */}
        <section 
            className="relative w-full py-24 md:py-32 flex items-center justify-center text-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    AI Learning for K-12 Students
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-200">
                    Master subjects from elementary to high school with a patient AI tutor that's available anytime, anywhere.
                </p>
                <button
                    onClick={() => onNavigate(Page.LOGIN)}
                    className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-transform transform hover:scale-105"
                >
                    Start Learning Today
                </button>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 w-full max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Your Personal Study Buddy</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <Feature 
                    title="24/7 Homework Help"
                    description="Stuck on a tricky math problem or a complex science concept? Get step-by-step explanations instantly, no matter the time of day."
                />
                <Feature 
                    title="Fun & Interactive Lessons"
                    description="Watch your AI tutor use a virtual blackboard to draw diagrams and illustrate ideas, making learning visual and engaging."
                />
                <Feature 
                    title="Exam & Test Prep"
                    description="Prepare for your exams with confidence. Review key topics, take practice quizzes, and identify areas where you need more practice."
                />
                <Feature 
                    title="Safe & Supportive Environment"
                    description="Ask any question without fear of judgment. Our AI provides a positive and encouraging space to learn and grow at your own pace."
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

export default K12LearningPage;
