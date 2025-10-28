import React, { useState } from 'react';
import { Session } from '../types';
import TeacherAvatarDisplay from './TeacherAvatar';

interface HistorySidebarProps {
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ sessions, onSelectSession, onNewChat, isCollapsed, onToggle }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSessions = sessions.filter(session =>
        session.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.transcript.some(t => t.text.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <aside
            className={`fixed top-16 bottom-0 left-0 bg-gray-900/80 backdrop-blur-md border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out z-20 ${
                isCollapsed ? 'w-20' : 'w-80'
            }`}
        >
            <div className="p-4 flex flex-col gap-4 flex-shrink-0">
                <button
                    onClick={onNewChat}
                    className={`w-full flex items-center gap-3 text-left p-3 transition-colors text-white font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    {!isCollapsed && <span>New Chat</span>}
                </button>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full bg-gray-800 border border-gray-700 rounded-md py-2 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${isCollapsed ? 'pl-3' : 'pl-9'}`}
                    />
                </div>
            </div>

            <div className="flex-1 px-4 pb-4 overflow-y-auto">
                <nav className="flex flex-col gap-1">
                    {filteredSessions.map((session) => (
                        <button
                            key={session.id}
                            onClick={() => onSelectSession(session)}
                            title={`Chat with ${session.teacherName}`}
                            className={`flex items-center gap-3 text-left p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-700/50 hover:text-white ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <TeacherAvatarDisplay 
                                teacher={{
                                    name: session.teacherName, 
                                    avatar: session.teacherAvatar, 
                                    avatarUrl: session.teacherAvatarUrl, 
                                    color: session.teacherColor,
                                } as any} 
                                className="w-8 h-8 rounded-full flex-shrink-0" 
                            />
                            {!isCollapsed && 
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-semibold text-sm truncate">{session.teacherName}</p>
                                    <p className="text-xs text-gray-400 truncate">{session.transcript[0]?.text || 'Empty session'}</p>
                                </div>
                            }
                        </button>
                    ))}
                </nav>
            </div>

            <div className="border-t border-gray-800 p-2 mt-auto">
                <button
                    onClick={onToggle}
                    title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                    className="w-full flex items-center justify-center gap-4 p-3 rounded-md text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors"
                >
                    {isCollapsed ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default HistorySidebar;
