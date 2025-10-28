import React, { useState, useRef, useEffect } from 'react';
import { Group, User, ChatMessage } from '../types';

const UserAvatar: React.FC<{ avatarUrl?: string, name: string, className?: string }> = ({ avatarUrl, name, className = 'w-8 h-8' }) => {
    if (avatarUrl) {
        return <img src={avatarUrl} alt={name} className={`${className} rounded-full object-cover`} />;
    }
    return (
        <div className={`${className} rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold`}>
            {name.charAt(0)}
        </div>
    );
};

interface ChatBubbleProps {
    message: ChatMessage;
    isCurrentUser: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isCurrentUser }) => {
    return (
        <div className={`flex items-start gap-3 ${isCurrentUser ? 'justify-end' : ''}`}>
            {!isCurrentUser && <UserAvatar name={message.authorName} avatarUrl={message.authorAvatarUrl} className="w-8 h-8 flex-shrink-0" />}
            <div className={`max-w-xs md:max-w-md rounded-xl px-4 py-2 ${
                isCurrentUser
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }`}>
                {!isCurrentUser && <p className="text-xs font-bold text-indigo-300 mb-1">{message.authorName}</p>}
                <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-400'} text-right`}>{message.timestamp}</p>
            </div>
        </div>
    );
};

interface GroupDetailViewProps {
    group: Group;
    currentUser: User;
    onBack: () => void;
    onSendMessage: (groupId: string, messageText: string) => void;
}

const GroupDetailView: React.FC<GroupDetailViewProps> = ({ group, currentUser, onBack, onSendMessage }) => {
    const [isCallActive, setIsCallActive] = useState(!!group.activeCallId);
    const [callId, setCallId] = useState<string | null>(group.activeCallId || null);
    const [newMessage, setNewMessage] = useState('');
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [group.chatHistory]);

    const handleStartCall = () => {
        const newCallId = `C-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        setCallId(newCallId);
        setIsCallActive(true);
        // In a real app, you would update the group state globally here.
    };

    const handleEndCall = () => {
        setCallId(null);
        setIsCallActive(false);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(group.id, newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 flex items-center gap-3">
                <button onClick={onBack} className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <div>
                    <h3 className="text-lg font-bold text-white">{group.name}</h3>
                    <p className="text-xs text-gray-400">{group.members.length} Members</p>
                </div>
            </div>
            
            {/* Top section with Call and Members */}
             <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Virtual Call Section */}
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-semibold text-white mb-2 text-center">Virtual Call</h4>
                    {isCallActive ? (
                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                Call in Progress
                            </div>
                             <button onClick={handleEndCall} className="w-full text-sm bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors">End Call</button>
                        </div>
                    ) : (
                         <button onClick={handleStartCall} className="w-full text-sm bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors">Start Call</button>
                    )}
                </div>
                 {/* Members List */}
                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-semibold text-white mb-2 text-center">Members</h4>
                     <div className="flex items-center justify-center -space-x-2">
                        {group.members.map(member => (
                            <div key={member.id} title={member.name}>
                                <UserAvatar name={member.name} avatarUrl={member.avatarUrl} className="w-8 h-8 border-2 border-gray-800"/>
                            </div>
                        ))}
                     </div>
                </div>
            </div>


            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {(group.chatHistory && group.chatHistory.length > 0) ? (
                    group.chatHistory.map(message => (
                        <ChatBubble key={message.id} message={message} isCurrentUser={message.authorId === currentUser.id} />
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
                    </div>
                )}
                 <div ref={endOfMessagesRef} />
            </div>

            {/* Message Input */}
             <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" disabled={!newMessage.trim()} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 rounded-full p-3 text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
                </form>
            </div>
        </div>
    );
};

export default GroupDetailView;