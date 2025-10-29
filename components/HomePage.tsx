import React, { useState, useEffect, useMemo } from 'react';
import { Page, LearningCategory } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const heroImages = [
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format=fit=crop",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106&auto=format&fit=crop",
];

const learningCategories: LearningCategory[] = [
  { title: 'Generative AI', description: 'Learn how to create images, text, and media using AI.', imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Python with AI', description: 'Combine Python programming with modern AI models.', imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Machine Learning (ML)', description: 'Build models that learn from data.', imageUrl: 'https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'Deep Learning', description: 'Dive into neural networks and transformers.', imageUrl: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'AI Agents', description: 'Explore intelligent agents that think and act autonomously.', imageUrl: 'https://images.unsplash.com/photo-1698224132044-f54245c5890b?q=80&w=800&auto=format=fit=crop' },
  { title: 'AutoML', description: 'Automate your model building and deployment process.', imageUrl: 'https://images.pexels.com/photos/18069699/pexels-photo-18069699.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'N8N Automation', description: 'Automate tasks and workflows using low-code AI tools.', imageUrl: 'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'AI Business Analytics', description: 'Learn how AI drives insights and decisions in business.', imageUrl: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'AI Ethics & Responsible AI', description: 'Understand fairness and transparency in AI model development.', imageUrl: 'https://images.pexels.com/photos/7849275/pexels-photo-7849275.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'AI in Robotics', description: 'Explore how AI powers robotics, automation, and computer vision.', imageUrl: 'https://images.pexels.com/photos/8386439/pexels-photo-8386439.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'AI in Education', description: 'Explore how AI personalizes modern learning.', imageUrl: 'https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'AI in Healthcare', description: 'Understand AI’s impact on diagnosis and imaging.', imageUrl: 'https://images.pexels.com/photos/8460151/pexels-photo-8460151.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { title: 'AI for Government Exams', description: 'Prepare for exams with AI-guided learning paths.', imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800' },
];


const LearningPathCard: React.FC<{
    title: string;
    description: string;
    features: string[];
    imageUrl: string;
    onNavigate: () => void;
    gradient: string;
}> = ({ title, description, features, imageUrl, onNavigate, gradient }) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        <div className="md:w-1/2">
            <img src={imageUrl} alt={title} className="w-full h-64 md:h-full object-cover" />
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <h3 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}>{title}</h3>
            <p className="text-gray-300 mt-3">{description}</p>
            <ul className="mt-6 space-y-3 text-sm">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                    </li>
                ))}
            </ul>
            <button
                onClick={onNavigate}
                className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 self-start"
            >
                Explore Now
            </button>
        </div>
    </div>
);

const AiLearningCard: React.FC<{
    category: LearningCategory;
    onNavigate: () => void;
    style?: React.CSSProperties;
}> = ({ category, onNavigate, style }) => (
    <div className="group bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 animate-fade-in-up transform hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl" style={style}>
        <div className="aspect-square overflow-hidden">
            <img loading="lazy" src={category.imageUrl} alt={category.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-base font-bold text-white">{category.title}</h3>
            <p className="text-gray-400 mt-2 text-sm flex-grow">{category.description}</p>
            <button
                onClick={onNavigate}
                className="mt-4 bg-gray-700 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors self-start text-xs"
            >
                Learn Now
            </button>
        </div>
    </div>
);

const EmpowermentCard: React.FC<{
    icon: string;
    title: string;
    description: string;
    imageUrl: string;
    buttonText: string;
    onNavigate: () => void;
    style?: React.CSSProperties;
}> = ({ icon, title, description, imageUrl, buttonText, onNavigate, style }) => (
    <div className="group bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={style}>
        <div className="aspect-video overflow-hidden">
            <img loading="lazy" src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">{icon} {title}</h3>
            <p className="text-gray-400 mt-2 text-sm flex-grow">{description}</p>
            <button
                onClick={onNavigate}
                className="mt-6 bg-gray-700 group-hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors self-start text-sm"
            >
                {buttonText}
            </button>
        </div>
    </div>
);

const empowermentCategories = [
    {
        icon: '🏫',
        title: 'AI Learning for Schools',
        description: 'Interactive lessons for grade 5 and above. Introduce students to AI tools, logic thinking, and creative coding.',
        imageUrl: 'https://images.pexels.com/photos/4144222/pexels-photo-4144222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        buttonText: 'Explore School Programs',
        page: Page.LEARNING_SCHOOLS,
    },
    {
        icon: '🎓',
        title: 'AI Learning for Colleges & Universities',
        description: 'Enable AI-driven learning environments, live research projects, and practical data science labs.',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format=fit=crop',
        buttonText: 'Discover Courses',
        page: Page.LEARNING_COLLEGE,
    },
    {
        icon: '🏢',
        title: 'Corporate AI Learning for Employees',
        description: 'Empower your teams with AI-driven skill development — from data analytics to automation tools.',
        imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        buttonText: 'Join Corporate Training',
        page: Page.CONTACT_SALES,
    },
    {
        icon: '🧾',
        title: 'AI Learning for Govt Exams',
        description: 'Smart AI-based test prep for UPSC, SSC, banking, and other competitive exams — powered by adaptive analytics.',
        imageUrl: 'https://images.pexels.com/photos/3184304/pexels-photo-3184304.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        buttonText: 'Start Learning',
        page: Page.LEARNING_EXAMS,
    }
];


const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() =>
    learningCategories.filter(cat =>
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]);

  useEffect(() => {
    const imageInterval = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(imageInterval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center text-white animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative text-center w-full min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute z-0 w-full h-full">
            {heroImages.map((src, index) => (
                <img
                    key={index}
                    src={src}
                    alt="Abstract futuristic background"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex ? 'opacity-30' : 'opacity-0'
                    }`}
                />
            ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/80 to-gray-900"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                Learn, Create, and Build the Future
            </h1>
             <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-2">
                with Your AI Teacher.
            </h2>
            <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                Experience AI-powered learning for Schools, Colleges, and Career Aspirants — plus create your own projects with AI Studio.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                 <a href="#learning-paths"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-transform transform hover:scale-105 shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                >
                    Explore AI Learning
                </a>
                <button
                    onClick={() => onNavigate(Page.STUDIO)}
                    className="px-6 py-3 bg-transparent hover:bg-gray-800/50 border border-gray-600 rounded-lg font-bold transition-colors"
                >
                    Open AI Studio
                </button>
            </div>
        </div>
      </section>

      {/* New AI Learning Paths Section */}
      <section id="learning-paths" className="py-20 px-4 w-full max-w-7xl mx-auto space-y-16">
        <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">A Smarter Way to Learn</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Personalized AI-driven learning paths designed for every stage of your educational journey.
            </p>
        </div>
        
        <LearningPathCard
            title="AI Learning for Schools (Grade 6-K12)"
            description="Empower the next generation with AI skills early. Interactive lessons, voice-based teaching, and real projects."
            features={[
                "Introduction to AI & Coding Basics",
                "Robotics & Automation Concepts",
                "AI Art, Math & Science Visualizations",
                "Gamified quizzes & progress tracking"
            ]}
            imageUrl="https://images.pexels.com/photos/8363116/pexels-photo-8363116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            onNavigate={() => onNavigate(Page.LEARNING_SCHOOLS)}
            gradient="from-green-400 to-cyan-400"
        />

        <LearningPathCard
            title="AI Learning for Higher Education"
            description="Advanced AI and technology learning for universities, engineering, and professional institutes — from Machine Learning to Automation."
            features={[
                "Advanced AI & Deep Learning",
                "Applied Machine Learning & Data Analytics",
                "Python + AI Integration & N8N Automation",
                "AI project submission and evaluation"
            ]}
            imageUrl="https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            onNavigate={() => onNavigate(Page.LEARNING_COLLEGE)}
            gradient="from-blue-400 to-purple-400"
        />
        
        <LearningPathCard
            title="AI Learning for Govt Exams & Career"
            description="Prepare smarter for government jobs, banking, civil services, and competitive exams — guided by your personal AI Teacher."
            features={[
                "UPSC / Civil Services (GS, CSAT, Essay)",
                "Banking & SSC Exam Preparation",
                "AI-powered question analysis & daily tests",
                "Interview Preparation with AI"
            ]}
            imageUrl="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            onNavigate={() => onNavigate(Page.LEARNING_EXAMS)}
            gradient="from-orange-400 to-red-400"
        />
      </section>
      
      {/* Empowering Every Learner Section */}
      <section id="empowering-learners" className="py-20 px-4 w-full max-w-7xl mx-auto">
        <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Empowering Every Learner Through AI</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                From schools to enterprises — discover how AI transforms learning, training, and innovation for everyone.
            </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {empowermentCategories.map((cat, index) => (
                <EmpowermentCard
                    key={cat.title}
                    icon={cat.icon}
                    title={cat.title}
                    description={cat.description}
                    imageUrl={cat.imageUrl}
                    buttonText={cat.buttonText}
                    onNavigate={() => onNavigate(cat.page)}
                    style={{ animationDelay: `${index * 100}ms` }}
                />
            ))}
        </div>
        <div className="mt-12 text-center">
            <button
                onClick={() => {
                    const element = document.getElementById('ai-programs');
                    element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gray-800/50 hover:bg-gray-700/80 border border-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
                👉 View All AI Learning Programs
            </button>
        </div>
    </section>

      {/* Explore AI Learning Programs Section */}
      <section id="ai-programs" className="py-20 px-4 w-full max-w-7xl mx-auto">
        <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">A Smarter Way to Learn Artificial Intelligence</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Explore our AI-powered learning modules designed for every level — from students to professionals. Learn interactively with the Nuro AI Teacher.
            </p>
        </div>
        <div className="mt-12 mb-8 max-w-2xl mx-auto">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search for a learning category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800/60 border border-gray-700 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat, index) => (
                <AiLearningCard 
                    key={cat.title} 
                    category={cat} 
                    onNavigate={() => onNavigate(Page.LIVE_CLASS)} 
                    style={{ animationDelay: `${index * 50}ms` }}
                />
            ))}
        </div>
      </section>

      {/* Nuro AI Teacher CTA Section */}
      <section className="py-20 px-4 w-full">
        <div className="max-w-4xl mx-auto text-center bg-gray-800/50 border border-gray-700 rounded-2xl p-10">
            <h2 className="text-3xl font-bold text-white mb-4">Learn with Nuro AI Teacher</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Every module is guided by your personal AI Teacher — chat, ask questions, download notes, and track your progress anytime.
            </p>
             <button
                onClick={() => onNavigate(Page.LIVE_CLASS)}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-transform transform hover:scale-105 shadow-lg shadow-indigo-500/20"
            >
                Start Learning with Nuro AI Teacher
            </button>
        </div>
      </section>

      {/* Section 5: Final CTA */}
      <section className="w-full bg-indigo-900/20 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Future?</h2>
            <p className="text-gray-300 mb-8">Join thousands of users who are taking control of their education. Sign up today and get your first session free.</p>
             <button
                onClick={() => onNavigate(Page.LOGIN)}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition-transform transform hover:scale-105 shadow-lg shadow-indigo-500/20"
            >
                Start Learning Now
            </button>
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
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          opacity: 0; /* Start hidden */
          animation: fade-in-up 0.5s ease-out forwards;
        }
       `}</style>
    </div>
  );
};

export default HomePage;
