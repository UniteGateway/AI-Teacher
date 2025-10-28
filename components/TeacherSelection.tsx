import React from 'react';
import { Teacher } from '../types';
import TeacherAvatarDisplay from './TeacherAvatar';

interface TeacherSelectionProps {
  teachers: Teacher[];
  onSelectTeacher: (teacher: Teacher) => void;
}

const TeacherCard: React.FC<{ teacher: Teacher; onSelect: () => void; }> = ({ teacher, onSelect }) => (
    <button 
        onClick={onSelect}
        className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 text-left flex flex-col items-center hover:bg-gray-700/50 hover:border-indigo-500/50 transition-all duration-200 transform hover:-translate-y-1"
    >
        <TeacherAvatarDisplay teacher={teacher} className="w-24 h-24 rounded-full mb-4"/>
        <h3 className={`text-xl font-bold text-${teacher.color}-400`}>{teacher.name}</h3>
        <p className="text-gray-400 text-sm mt-2 text-center flex-grow">{teacher.description}</p>
    </button>
);

const TeacherSelection: React.FC<TeacherSelectionProps> = ({ teachers, onSelectTeacher }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white">Start a New Conversation</h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          Choose an AI Teacher to begin your personalized learning session. Each teacher has a unique style and area of expertise.
        </p>
      </div>
      <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.map(teacher => (
            <TeacherCard key={teacher.id} teacher={teacher} onSelect={() => onSelectTeacher(teacher)} />
        ))}
      </div>
    </div>
  );
};

export default TeacherSelection;
