import React from 'react';
import { Teacher } from '../types';

interface TeacherAvatarProps {
  teacher: Teacher;
  className?: string;
  isSpeaking?: boolean;
}

const TeacherAvatarDisplay: React.FC<TeacherAvatarProps> = ({ teacher, className, isSpeaking }) => {
  const DefaultAvatar = teacher.avatar;
  const animationClass = isSpeaking ? 'animate-pulse-speak' : '';
  
  if (teacher.avatarUrl) {
    return <img src={teacher.avatarUrl} alt={teacher.name} className={`${className} ${animationClass} object-cover`} />;
  }
  
  return <DefaultAvatar className={`${className} ${animationClass}`} />;
};

export default TeacherAvatarDisplay;