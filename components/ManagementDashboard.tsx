import React, { useState, useRef } from 'react';
import { Teacher } from '../types';
import TeacherAvatarDisplay from './TeacherAvatar';

interface ManagementDashboardProps {
  teachers: Teacher[];
  onUpdateTeacher: (teacher: Teacher) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 flex items-center gap-4">
        <div className="bg-indigo-600/20 text-indigo-400 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const EditTeacherForm: React.FC<{ teacher: Teacher; onSave: (updatedTeacher: Teacher) => void; onCancel: () => void; }> = ({ teacher, onSave, onCancel }) => {
    const [name, setName] = useState(teacher.name);
    const [avatarPreview, setAvatarPreview] = useState<string | undefined>(teacher.avatarUrl);
    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedTeacher = {
            ...teacher,
            name,
            avatarUrl: avatarPreview || teacher.avatarUrl,
        };
        onSave(updatedTeacher);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-700/50 p-4 rounded-b-lg space-y-4">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover"/>
                    ) : (
                        <TeacherAvatarDisplay teacher={teacher} className="w-16 h-16 rounded-full"/>
                    )}
                </div>
                <div className="flex-1">
                    <label htmlFor="name" className="text-sm font-bold text-gray-400 block mb-1">Teacher Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>
             <div>
                <label className="text-sm font-bold text-gray-400 block mb-1">Custom Avatar</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30"
                />
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">Save Changes</button>
            </div>
        </form>
    );
};


const ManagementDashboard: React.FC<ManagementDashboardProps> = ({ teachers, onUpdateTeacher }) => {
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

  const handleSave = (updatedTeacher: Teacher) => {
    onUpdateTeacher(updatedTeacher);
    setEditingTeacherId(null);
  };

  return (
    <div className="p-8 text-white space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Management Dashboard</h1>
        <p className="text-lg text-gray-400">
            Oversee platform analytics, manage AI teachers, and monitor student progress.
        </p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="1,284" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
        <StatCard title="Active Sessions" value="76" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>} />
        <StatCard title="Avg. Session Time" value="24.5 min" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
        <StatCard title="Avg. Teacher Rating" value="4.8 / 5" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-gray-800/70 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Student Engagement (Last 30 Days)</h3>
            <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center p-4">
                <svg width="100%" height="100%" viewBox="0 0 300 150">
                    <path d="M 0 130 C 50 100, 100 50, 150 80 S 250 140, 300 110" stroke="#818cf8" fill="none" strokeWidth="2"/>
                    <line x1="0" y1="150" x2="300" y2="150" stroke="#4a5568" />
                    <text x="150" y="20" fill="#a0aec0" textAnchor="middle" fontSize="12">Engagement Over Time</text>
                </svg>
            </div>
        </div>
        <div className="lg:col-span-2 bg-gray-800/70 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Teacher Popularity</h3>
            <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <svg width="150" height="150" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4c1d95" strokeWidth="10"/>
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#6d28d9" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="62.8" transform="rotate(-90 50 50)"/>
                    <text x="50" y="55" textAnchor="middle" fill="#fff" fontSize="12">75%</text>
                </svg>
            </div>
        </div>
      </div>

      {/* Teacher Management */}
      <div className="bg-gray-800/70 p-6 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6">AI Teacher Management</h2>
        <div className="space-y-4">
            {teachers.map(teacher => (
                <div key={teacher.id} className="bg-gray-900/50 rounded-lg border border-gray-700">
                   <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <TeacherAvatarDisplay teacher={teacher} className="w-12 h-12 rounded-full" />
                            <div>
                                <h3 className="text-xl font-bold">{teacher.name}</h3>
                                <p className="text-sm text-gray-400">{teacher.description}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setEditingTeacherId(editingTeacherId === teacher.id ? null : teacher.id)}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                            {editingTeacherId === teacher.id ? 'Close' : 'Edit'}
                        </button>
                   </div>
                   {editingTeacherId === teacher.id && (
                        <EditTeacherForm 
                            teacher={teacher}
                            onSave={handleSave}
                            onCancel={() => setEditingTeacherId(null)}
                        />
                   )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;