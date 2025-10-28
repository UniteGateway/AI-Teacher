import React, { useState, useMemo } from 'react';
import { Group, User } from '../types';

const UserAvatar: React.FC<{ avatarUrl?: string, name: string, className?: string }> = ({ avatarUrl, name, className = 'w-6 h-6' }) => {
    if (avatarUrl) {
        return <img src={avatarUrl} alt={name} className={`${className} rounded-full object-cover`} />;
    }
    return (
        <div className={`${className} rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold`}>
            {name.charAt(0)}
        </div>
    );
};

interface GroupCardProps {
    group: Group;
    isMember: boolean;
    onJoin: (group: Group) => void;
    onLeave: (group: Group) => void;
    onSelect: (group: Group) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, isMember, onJoin, onLeave, onSelect }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex flex-col h-full">
        <div className="flex-1">
            <h4 className="font-bold text-white truncate cursor-pointer hover:text-indigo-400" onClick={() => onSelect(group)}>{group.name}</h4>
            <p className="text-xs text-gray-400 mt-1 h-8">{group.description}</p>
        </div>
        <div className="flex items-center justify-between mt-3">
            <div className="flex items-center -space-x-2">
                {group.members.slice(0, 4).map(member => (
                    <UserAvatar key={member.id} name={member.name} avatarUrl={member.avatarUrl} className="w-6 h-6 border-2 border-gray-800" />
                ))}
                {group.members.length > 4 && (
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-800">
                        +{group.members.length - 4}
                    </div>
                )}
            </div>
            {isMember ? (
                <button onClick={() => onLeave(group)} className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold py-1 px-3 rounded-full transition-colors">Leave</button>
            ) : (
                <button onClick={() => onJoin(group)} className="text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 font-semibold py-1 px-3 rounded-full transition-colors">Join</button>
            )}
        </div>
    </div>
);

interface CreateGroupModalProps {
    onCreate: (name: string, description: string) => void;
    onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onCreate, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && description.trim()) {
            onCreate(name.trim(), description.trim());
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-white mb-4">Create a New Group</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="group-name" className="text-sm font-semibold text-gray-300 block mb-1">Group Name</label>
                        <input id="group-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                     <div>
                        <label htmlFor="group-description" className="text-sm font-semibold text-gray-300 block mb-1">Description</label>
                        <textarea id="group-description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Create Group</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface GroupsViewProps {
    groups: Group[];
    currentUser: User;
    onCreateGroup: (name: string, description: string) => void;
    onJoinGroup: (group: Group) => void;
    onLeaveGroup: (group: Group) => void;
    onSelectGroup: (group: Group) => void;
}

const GroupsView: React.FC<GroupsViewProps> = ({ groups, currentUser, onCreateGroup, onJoinGroup, onLeaveGroup, onSelectGroup }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    const { myGroups, discoverGroups } = useMemo(() => {
        const myGroups: Group[] = [];
        const discoverGroups: Group[] = [];
        groups.forEach(group => {
            if (group.members.some(member => member.id === currentUser.id)) {
                myGroups.push(group);
            } else {
                discoverGroups.push(group);
            }
        });
        return { myGroups, discoverGroups };
    }, [groups, currentUser]);
    
    return (
        <div className="flex flex-col h-full">
            {isCreateModalOpen && <CreateGroupModal onCreate={onCreateGroup} onClose={() => setIsCreateModalOpen(false)} />}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Student Groups</h3>
                <button onClick={() => setIsCreateModalOpen(true)} className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Create Group
                </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-6">
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">My Groups ({myGroups.length})</h4>
                    {myGroups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {myGroups.map(group => <GroupCard key={group.id} group={group} isMember={true} onLeave={onLeaveGroup} onJoin={onJoinGroup} onSelect={onSelectGroup} />)}
                        </div>
                    ) : (
                         <p className="text-sm text-gray-500">You haven't joined any groups yet.</p>
                    )}
                </div>
                 <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Discover Groups ({discoverGroups.length})</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {discoverGroups.map(group => <GroupCard key={group.id} group={group} isMember={false} onLeave={onLeaveGroup} onJoin={onJoinGroup} onSelect={onSelectGroup} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupsView;
