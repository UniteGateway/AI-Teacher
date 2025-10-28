import React from 'react';
import { Page } from '../../types';

interface CollegeLearningPageProps {
  onNavigate: (page: Page) => void;
}

const Feature: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 h-full">
        <h3 className="text-xl font-bold text-blue-400">{title}</h3>
        <p className="mt-2 text-gray-300">{description}</p>
    </div>
);

const CollegeLearningPage: React.FC<CollegeLearningPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col items-center text-white animate-fade-in px-4">
        {/* Hero Section */}
        <section 
            className="relative w-full py-24 md:py-32 flex items-center justify-center text-center"
            style={{ backgroundImage: `url('https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
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
                    Start Your Session
                </button>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 w-full max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Achieve Academic Excellence</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Feature 
                    title="Advanced AI & Deep Learning"
                    description="Grasp complex subjects like neural networks and transformer models with an AI that can break down intricate concepts visually."
                />
                <Feature 
                    title="Applied Machine Learning"
                    description="Go from theory to practice. Work on real-world datasets and get guidance on building and evaluating your ML models."
                />
                <Feature 
                    title="Python + AI Integration"
                    description="Master Python for AI. Get help with libraries like TensorFlow and PyTorch, and debug your code with AI assistance."
                />
                 <Feature 
                    title="Live Labs with AI"
                    description="Receive voice and visual explanations for complex models and algorithms, making abstract concepts tangible and easier to understand."
                />
                <Feature 
                    title="AI for Engineering & Research"
                    description="Brainstorm ideas, organize your thesis, and get feedback on your papers. Streamline your research process from start to finish."
                />
                 <Feature 
                    title="AI Automation (N8N)"
                    description="Learn no-code automation. Build powerful workflows and connect APIs to automate tasks for your projects and research."
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

export default CollegeLearningPage;
