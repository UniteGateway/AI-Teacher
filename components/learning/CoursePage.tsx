import React from 'react';
import { Page, CourseInfo } from '../../types';

interface CoursePageProps {
  course: CourseInfo;
  onNavigate: (page: Page) => void;
}

const FeatureIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-10 h-10 bg-indigo-600/20 text-indigo-300 rounded-full flex items-center justify-center flex-shrink-0">
        {children}
    </div>
);

const CoursePage: React.FC<CoursePageProps> = ({ course, onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col items-center text-white animate-fade-in">
        {/* Hero Section */}
        <section 
            className="relative w-full py-24 md:py-32 flex items-center justify-center text-center"
            style={{ backgroundImage: `url('${course.heroImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
            <div className="relative z-10 max-w-3xl mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    {course.title}
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-200">
                    {course.tagline}
                </p>
            </div>
        </section>

        {/* Main Content */}
        <section className="py-16 w-full max-w-5xl mx-auto px-4 grid lg:grid-cols-3 gap-12">
            {/* Left: Course Structure */}
            <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-6">Course Structure</h2>
                <div className="overflow-x-auto bg-gray-800/50 border border-gray-700 rounded-lg">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="p-4 font-semibold">Module</th>
                                <th className="p-4 font-semibold">Description</th>
                                <th className="p-4 font-semibold">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {course.modules.map((mod, index) => (
                                <tr key={index} className="border-t border-gray-700">
                                    <td className="p-4 font-bold text-indigo-300">{index + 1}. {mod.title}</td>
                                    <td className="p-4 text-gray-300">{mod.description}</td>
                                    <td className="p-4">
                                        <span className="text-xs font-bold px-2 py-1 bg-gray-600 text-gray-200 rounded-full">{mod.type}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right: Learning Features & CTA */}
            <div className="lg:col-span-1">
                 <h2 className="text-3xl font-bold mb-6">Learning Features</h2>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4"><FeatureIcon>👩‍🏫</FeatureIcon> <span>Learn interactively with AI Teacher (voice/text)</span></div>
                    <div className="flex items-center gap-4"><FeatureIcon>🧠</FeatureIcon> <span>Ask questions anytime</span></div>
                    <div className="flex items-center gap-4"><FeatureIcon>🎧</FeatureIcon> <span>Option for voice-based explanation</span></div>
                    <div className="flex items-center gap-4"><FeatureIcon>📚</FeatureIcon> <span>Save notes and export as PDF</span></div>
                    <div className="flex items-center gap-4"><FeatureIcon>🎓</FeatureIcon> <span>Certificate after completion</span></div>
                 </div>

                 <div className="mt-10 p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-lg text-center">
                    <h3 className="text-2xl font-bold">Ready to Begin?</h3>
                    <p className="text-gray-300 mt-2">Start your learning journey today with your personal AI guide.</p>
                     <button
                        onClick={() => onNavigate(Page.LOGIN)}
                        className="mt-6 w-full px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-transform transform hover:scale-105"
                    >
                        Start Learning with AI Teacher
                    </button>
                 </div>
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

export default CoursePage;
