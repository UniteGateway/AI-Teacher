import React from 'react';
import { Page } from '../types';

interface AiTeacherLandingPageProps {
  onNavigate: (page: Page) => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-center transform transition-transform duration-300 hover:-translate-y-2">
        <div className="text-4xl mb-4 inline-block">{icon}</div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-gray-400 text-sm">{description}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; role: string; avatar: string; }> = ({ quote, name, role, avatar }) => (
    <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
        <p className="text-gray-300 italic">"{quote}"</p>
        <div className="flex items-center mt-4">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
            <div className="ml-4">
                <p className="font-semibold text-white">{name}</p>
                <p className="text-indigo-400 text-sm">{role}</p>
            </div>
        </div>
    </div>
);


const AiTeacherLandingPage: React.FC<AiTeacherLandingPageProps> = ({ onNavigate }) => {

    return (
        <div className="flex-1 flex flex-col items-center text-white animate-fade-in-up">
            {/* Hero Section */}
            <section 
                className="relative text-center w-full min-h-[70vh] flex items-center justify-center overflow-hidden py-20 px-4"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/50 to-gray-900 opacity-80 z-0"></div>
                 <div 
                    className="absolute inset-0 bg-cover bg-center opacity-10" 
                    style={{backgroundImage: `url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop')`}}
                ></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">
                        Meet Your AI Teacher
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                        Personalized learning powered by cutting-edge Artificial Intelligence. Adaptive lessons, instant answers, and 24/7 support for students, schools, and professionals.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => onNavigate(Page.LOGIN)}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-transform transform hover:scale-105 shadow-lg shadow-indigo-500/20"
                        >
                            Start Free Trial
                        </button>
                        <button
                            onClick={() => onNavigate(Page.WATCH_DEMO)}
                            className="px-6 py-3 bg-transparent hover:bg-gray-800/50 border border-gray-600 rounded-lg font-bold transition-colors"
                        >
                            Watch Demo
                        </button>
                    </div>
                </div>
            </section>
            
            {/* About Section */}
            <section className="py-20 px-4 w-full bg-gray-900">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">What is AI Teacher?</h2>
                    <p className="mt-4 text-gray-400 max-w-3xl mx-auto">
                        AI Teacher is an intelligent tutor system by Nuro AI Labs. It helps students learn faster through adaptive tutoring, adjusting lessons in real-time, answering questions, evaluating tests, and supporting schools, colleges, and corporate learners.
                    </p>
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        <div className="text-center"><div className="text-3xl">🧩</div><p className="text-xs mt-2">Adaptive Learning</p></div>
                        <div className="text-center"><div className="text-3xl">💬</div><p className="text-xs mt-2">Instant Q&A</p></div>
                        <div className="text-center"><div className="text-3xl">📊</div><p className="text-xs mt-2">Progress Tracking</p></div>
                        <div className="text-center"><div className="text-3xl">🎓</div><p className="text-xs mt-2">All Subjects</p></div>
                        <div className="text-center"><div className="text-3xl">🌐</div><p className="text-xs mt-2">Multilingual</p></div>
                        <div className="text-center"><div className="text-3xl">🧠</div><p className="text-xs mt-2">Personalized Plans</p></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 w-full max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Everything You Need to Succeed</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon="📝"
                        title="Smart Lesson Planning"
                        description="AI generates personalized study plans based on your learning goals and progress, ensuring you focus on what matters most."
                    />
                     <FeatureCard 
                        icon="🗣️"
                        title="Voice Interaction"
                        description="Simply talk to your AI Teacher. Ask questions, practice concepts, and get explanations in a natural, conversational way."
                    />
                     <FeatureCard 
                        icon="✍️"
                        title="Exam Practice Generator"
                        description="Create unlimited practice tests and quizzes for any subject. The AI provides detailed feedback and performance analysis."
                    />
                     <FeatureCard 
                        icon="🏫"
                        title="School Integration"
                        description="Nuro AI Labs offers seamless integration for schools and institutions, complete with a management dashboard and API access."
                    />
                     <FeatureCard 
                        icon="🎨"
                        title="Works with Nuro Studio"
                        description="Generate images, videos, and presentations for your school projects directly from your learning environment."
                    />
                      <FeatureCard 
                        icon="💬"
                        title="Connects with Nuro Chat"
                        description="Seamlessly switch between your AI Teacher and the powerful Nuro Chat for broader questions and creative tasks."
                    />
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 w-full bg-gray-900/50">
                 <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-green-400">For Students</h3>
                        <p className="mt-2 text-gray-300">Learn 2x faster, get 24/7 tutoring support, and prepare effectively for competitive exams with a personal AI mentor that never gets tired.</p>
                    </div>
                     <div>
                        <h3 className="text-2xl font-bold text-blue-400">For Teachers & Schools</h3>
                        <p className="mt-2 text-gray-300">Reduce teacher workload, monitor student performance with smart reports, and provide personalized attention to every student at scale.</p>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-20 px-4 w-full max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white">See It in Action</h2>
                <p className="mt-4 text-gray-400 mb-8">Experience how AI Teacher adapts to your learning style in real-time.</p>
                <div className="aspect-video bg-gray-800 border-2 border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/10">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-indigo-700 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        <p className="mt-4 text-gray-400">Demo Video Coming Soon</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-4 w-full bg-gray-900">
                 <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Trusted by Learners & Educators</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <TestimonialCard 
                            quote="Nuro's AI Teacher is a game-changer. I finally understood calculus because I could ask questions at my own pace without feeling embarrassed."
                            name="Alex Johnson"
                            role="University Student"
                            avatar="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=128"
                        />
                         <TestimonialCard 
                            quote="As a teacher, this tool allows me to give personalized attention to all 30 of my students simultaneously. The progress tracking is incredible."
                            name="Maria Garcia"
                            role="High School Teacher"
                            avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=128"
                        />
                    </div>
                 </div>
            </section>

            {/* Final CTA Section */}
            <section className="w-full bg-indigo-900/20 py-20 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">Ready to Learn Smarter?</h2>
                    <p className="text-gray-300 mb-8">Join thousands of users who are taking control of their education. Sign up today and get your first session free.</p>
                    <div className="flex items-center justify-center gap-4">
                        <button onClick={() => onNavigate(Page.LOGIN)} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-transform transform hover:scale-105">Sign In</button>
                        <button onClick={() => onNavigate(Page.LOGIN)} className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors">Create Account</button>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AiTeacherLandingPage;