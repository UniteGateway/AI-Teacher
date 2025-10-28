import React, { useState, useEffect } from 'react';
import { TeamMember } from '../types';
import { getTeamMembers } from '../supabaseClient';

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-center">
        <img src={member.imageUrl} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-700"/>
        <h3 className="text-xl font-bold text-white">{member.name}</h3>
        <p className="text-indigo-400 font-semibold mb-2">{member.title}</p>
        <p className="text-gray-400 text-sm">{member.bio}</p>
    </div>
);

const AboutPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
        setIsLoading(true);
        const fetchedTeam = await getTeamMembers();
        setTeam(fetchedTeam);
        setIsLoading(false);
    };
    fetchTeam();
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center pt-16 md:pt-24 text-white animate-fade-in px-4">
      
      {/* Header Section */}
      <section className="text-center w-full max-w-4xl mx-auto py-12">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          About <span className="text-indigo-400">Nuro AI Labs</span>
        </h1>
        <p className="mt-6 text-lg text-gray-300">
          We are a team of educators, technologists, and innovators dedicated to making personalized learning accessible to everyone, everywhere.
        </p>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
          <h2 className="text-3xl font-bold text-green-400 mb-4">Our Mission</h2>
          <p className="text-gray-300">
            To harness the power of artificial intelligence to create highly personalized and effective learning experiences that adapt to the unique needs of every student, fostering a world where curiosity thrives and potential is limitless.
          </p>
        </div>
        <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
          <h2 className="text-3xl font-bold text-blue-400 mb-4">Our Vision</h2>
          <p className="text-gray-300">
            To build a future where every individual has an AI-powered mentor to guide them on their educational journey, breaking down barriers to knowledge and empowering the next generation of thinkers, creators, and leaders.
          </p>
        </div>
      </section>

      {/* Core Team Section */}
      <section className="py-16 w-full max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Meet the Core Team</h2>
        {isLoading ? (
            <div className="text-center text-gray-400">Loading team...</div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map(member => (
                    <TeamMemberCard key={member.id} member={member} />
                ))}
            </div>
        )}
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

export default AboutPage;
