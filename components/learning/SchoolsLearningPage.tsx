import React from 'react';
import { Page } from '../../types';

interface SchoolsLearningPageProps {
  onNavigate: (page: Page) => void;
}

const Feature: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 h-full">
        <h3 className="text-xl font-bold text-green-400">{title}</h3>
        <p className="mt-2 text-gray-300">{description}</p>
    </div>
);

const SchoolsLearningPage: React.FC<SchoolsLearningPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col items-center text-white animate-fade-in px-4">
        {/* Hero Section */}
        <section 
            className="relative w-full py-24 md:py-32 flex items-center justify-center text-center"
            style={{ backgroundImage: `url('https://images.pexels.com/photos/8363116/pexels-photo-8363116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    AI Learning for Schools (6th-K12)
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-200">
                    Making Learning Smarter, Simpler, and Fun with AI. Master subjects from elementary to high school with a patient tutor that's available 24/7.
                </p>
                <button
                    onClick={() => onNavigate(Page.LOGIN)}
                    className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-transform transform hover:scale-105"
                >
                    Start Learning with AI Teacher
                </button>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 w-full max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Your Personal Study Buddy</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Feature 
                    title="Interactive Subjects"
                    description="Dive into AI Math, AI Science, and Creative Arts. Get instant help and visual explanations on the virtual blackboard."
                />
                <Feature 
                    title="Learn-by-Talking"
                    description="Practice concepts by having a natural conversation with your AI Teacher. Ask questions and get answers in a supportive, judgment-free zone."
                />
                <Feature 
                    title="School Projects with AI"
                    description="Create stunning posters, charts, presentations, and videos for your school projects using the integrated AI Studio."
                />
                 <Feature 
                    title="Daily Quizzes & Fun Games"
                    description="Reinforce your learning through gamified quizzes and educational games that make studying enjoyable and effective."
                />
                <Feature 
                    title="Exam & Test Prep"
                    description="Prepare for your exams with confidence. Review key topics, take practice quizzes, and identify areas where you need more practice."
                />
                 <Feature 
                    title="Parent & Teacher Dashboard"
                    description="Parents and teachers can monitor progress, view learning analytics, and understand areas of strength and weakness."
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

export default SchoolsLearningPage;
