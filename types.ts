import React from 'react';

export enum CallStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING',
  ENDED = 'ENDED',
  ERROR = 'ERROR',
}

export enum TranscriptAuthor {
  USER = 'USER',
  AI = 'AI',
  SYSTEM = 'SYSTEM',
}

export interface TranscriptEntry {
  author: TranscriptAuthor;
  text: string;
  timestamp: string;
}

export interface Voice {
  name: string; // This will be 'Zephyr', 'Puck', etc.
  region: string; // This is the user-facing label, e.g., 'British English'
}

export interface Teacher {
  id: string;
  name: string;
  avatar: React.FC<{className?: string}>;
  avatarUrl?: string; // To store URLs for uploaded images
  description: string;
  systemInstruction: string;
  color: string;
  voice: Voice; // Default voice
  availableVoices: Voice[]; // All possible voices
}

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  MANAGEMENT = 'MANAGEMENT',
  ADVERTISER = 'ADVERTISER',
}

export interface User {
    id: string;
    name: string;
    role: UserRole;
    avatarUrl?: string;
}

export enum Page {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  NURO_CHAT = 'NURO_CHAT',
  STUDIO = 'STUDIO',
  DASHBOARD = 'DASHBOARD',
  PRICING = 'PRICING',
  CONTACT_SALES = 'CONTACT_SALES',
  LIVE_CLASS = 'LIVE_CLASS',
  LOGIN = 'LOGIN',
  PROFILE = 'PROFILE',
  WATCH_DEMO = 'WATCH_DEMO',
  // New Learning Path Pages
  LEARNING_SCHOOLS = 'LEARNING_SCHOOLS',
  LEARNING_COLLEGE = 'LEARNING_COLLEGE',
  LEARNING_EXAMS = 'LEARNING_EXAMS',
  AI_WEBSITE_BUILDER = 'AI_WEBSITE_BUILDER',
  AI_DESIGN_PREVIEW = 'AI_DESIGN_PREVIEW',
}

export interface Session {
  id: string;
  teacherName: string;
  teacherAvatar: React.FC<{className?: string}>;
  teacherAvatarUrl?: string;
  teacherColor: string;
  date: string;
  transcript: TranscriptEntry[];
  // Fix: Added voice and availableVoices to the Session interface to properly store teacher info.
  voice: Voice;
  availableVoices: Voice[];
}

export enum ExpertStatus {
    ONLINE = 'Online',
    OFFLINE = 'Offline',
}

export interface SubjectExpert {
    id:string;
    name: string;
    avatar: React.FC<{className?: string}>;
    subject: string;
    status: ExpertStatus;
}

export interface Currency {
  code: string;
  symbol: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
}

export interface PricingPlan {
  name: string;
  price: {
    monthly: number | 'Free' | 'Custom';
    yearly: number | 'Free' | 'Custom';
  };
  description: string;
  features: string[];
  isFeatured?: boolean;
}

export enum GoalStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export interface LearningGoal {
  id: string;
  text: string;
  status: GoalStatus;
}

// --- Blackboard Drawing Types ---
export type Shape = 'RECT' | 'CIRCLE' | 'LINE';

export interface DrawingCommand {
  shape: Shape;
  color: string;
  params: { [key: string]: number };
}

export interface ContentPart {
  type: 'text' | 'highlight';
  value: string;
}

// --- Group Types ---
export interface GroupMember {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface ChatMessage {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl?: string;
    text: string;
    timestamp: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  activeCallId?: string | null;
  chatHistory?: ChatMessage[];
}

// --- Course Types ---
export interface CourseModule {
    title: string;
    description: string;
    type: 'Video Lesson' | 'Interactive' | 'Practical' | 'Hands-on';
}

export interface CourseInfo {
    page: Page;
    title: string;
    tagline: string;
    heroImage: string;
    modules: CourseModule[];
    homeCard: {
        title: string;
        description: string;
        imageUrl: string;
    }
}

export interface LearningCategory {
  title: string;
  description: string;
  imageUrl: string;
}

export interface AiTool {
  name: string;
  description: string;
  thumbnailUrl: string;
  iframeUrl: string;
  embeddable?: boolean;
}