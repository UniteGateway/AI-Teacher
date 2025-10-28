import React, { useState } from 'react';
import { User, Currency, ExpertStatus } from '../types';

interface TeacherDashboardProps {
  teacher: User;
  currency: Currency;
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

const MOCK_SCHEDULE = [
    { name: 'Alex Johnson', topic: 'Intro to Thermodynamics', time: '11:00 AM', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=128' },
    { name: 'Maria Garcia', topic: 'Color Theory Basics', time: '2:00 PM', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=128' },
    { name: 'Kenji Tanaka', topic: 'Calculus II Review', time: '4:30 PM', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128' },
];

const ScheduleItem: React.FC<{ name: string; topic: string; time: string; avatarUrl: string }> = ({ name, topic, time, avatarUrl }) => (
    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
        <div className="flex items-center gap-4">
            <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full object-cover" />
            <div>
                <p className="font-semibold text-white">{name}</p>
                <p className="text-sm text-gray-400">{topic}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="font-semibold text-indigo-400">{time}</p>
            <button className="text-sm text-green-400 hover:underline">Start Class</button>
        </div>
    </div>
);


const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacher, currency }) => {
    const [status, setStatus] = useState<ExpertStatus>(ExpertStatus.OFFLINE);

    return (
    <div className="p-8 text-white space-y-8">
        <div>
            <h1 className="text-4xl font-bold mb-2">Teacher Dashboard</h1>
            <p className="text-lg text-gray-400">
                Welcome back, {teacher.name}. Here's your summary for today.
            </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Monthly Earnings" value={`${currency.symbol}2,450`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="1" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>} />
            <StatCard title="Avg. Rating" value="4.9 / 5" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>} />
            <StatCard title="Total Students" value="82" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
            <StatCard title="Upcoming Classes" value="3" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>} />
        </div>

        {/* Schedule and Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-800/70 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Today's Schedule</h3>
                <div className="space-y-3">
                    {MOCK_SCHEDULE.map(item => (
                        <ScheduleItem key={item.name} {...item} />
                    ))}
                </div>
            </div>
            <div className="lg:col-span-1 bg-gray-800/70 p-6 rounded-xl border border-gray-700 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Your Status</h3>
                    <p className="text-sm text-gray-400 mb-4">Set your status to "Online" to be available for instant Live Class sessions.</p>
                </div>
                <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${status === ExpertStatus.ONLINE ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span className={`font-semibold ${status === ExpertStatus.ONLINE ? 'text-green-300' : 'text-gray-400'}`}>{status}</span>
                    </div>
                    <button 
                        onClick={() => setStatus(s => s === ExpertStatus.ONLINE ? ExpertStatus.OFFLINE : ExpertStatus.ONLINE)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${status === ExpertStatus.ONLINE ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    >
                        {status === ExpertStatus.ONLINE ? 'Go Offline' : 'Go Online'}
                    </button>
                </div>
            </div>
        </div>

    </div>
  );
};

export default TeacherDashboard;