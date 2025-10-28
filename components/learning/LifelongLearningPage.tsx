import React from 'react';
import { Page } from '../../types';

interface LifelongLearningPageProps {
  onNavigate: (page: Page) => void;
}

const Feature: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold text-orange-400">{title}</h3>
        <p className="mt-2 text-gray-300">{description}</p>
    </div>
);

const LifelongLearningPage: React.FC<LifelongLearningPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col items-center text-white animate-fade-in px-4">
        {/* Hero Section */}
        <section 
            className="relative w-full py-24 md:py-32 flex items-center justify-center text-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1533628635777-112b2239b1c7?q=80&w=2070&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    AI for Lifelong Learners
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-200">
                    It's never too late to learn something new. Explore your passions, pick up a new hobby, or simply feed your curiosity.
                </p>
                <button
                    onClick={() => onNavigate(Page.LOGIN)}
                    className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-transform transform hover:scale-105"
                >
                    Explore Your Interests
                </button>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 w-full max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Stay Curious, Keep Growing</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <Feature 
                    title="Creative Arts & Hobbies"
                    description="Learn to paint, play the guitar, or write a novel. Get creative prompts, technique explanations, and constructive feedback."
                />
                <Feature 
                    title="Personal Finance & Investing"
                    description="Understand the stock market, learn about budgeting, and explore investment strategies in simple, easy-to-understand terms."
                />
                <Feature 
                    title="History, Philosophy & Culture"
                    description="Dive deep into any topic that fascinates you. Ask complex questions and get nuanced answers from an AI that has read millions of books."
                />
                <Feature 
                    title="Everyday Skills"
                    description="From cooking techniques to basic home repair or gardening, learn practical skills to enrich your daily life."
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

export default LifelongLearningPage;
