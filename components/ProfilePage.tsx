import React, { useState, useRef } from 'react';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateUser({ ...user, name, avatarUrl: avatarPreview });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setName(user.name);
    setAvatarPreview(user.avatarUrl);
    setIsEditing(false);
  }

  const UserAvatar: React.FC<{ size: string }> = ({ size }) => {
    const url = isEditing ? avatarPreview : user.avatarUrl;
    if (url) {
        return <img src={url} alt={user.name} className={`${size} rounded-full object-cover border-4 border-gray-700`} />;
    }
    return (
        <div className={`${size} rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-5xl border-4 border-gray-700`}>
            {user.name.charAt(0)}
        </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-8 animate-fade-in">
        <div className="w-full max-w-2xl bg-gray-800/50 p-8 rounded-2xl border border-gray-700 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative">
                    <UserAvatar size="w-32 h-32" />
                    {isEditing && (
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-1 right-1 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9z"></path><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="12" y1="15" x2="12" y2="21"></line><line x1="9" y1="18" x2="15" y2="18"></line></svg>
                        </button>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    {isEditing ? (
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-3xl font-bold bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-white"
                        />
                    ) : (
                        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                    )}
                    <p className="text-indigo-400 mt-1">{user.role}</p>
                </div>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                        Edit Profile
                    </button>
                )}
            </div>
            
            {isEditing && (
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={handleCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Save Changes</button>
                </div>
            )}
        </div>
    </div>
  );
};

export default ProfilePage;
