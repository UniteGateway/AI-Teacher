import { Teacher, User, UserRole, SubjectExpert, ExpertStatus, TeamMember, Group, Voice, Session, TranscriptEntry, TranscriptAuthor } from './types';
import { ScientistAvatar, ArtistAvatar, HistorianAvatar } from './components/Avatars';

// --- SUPABASE CLIENT SETUP ---
// In a real application, you would initialize your Supabase client here.
// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = 'YOUR_SUPABASE_URL'
// const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
// export const supabase = createClient(supabaseUrl, supabaseKey)

// For this project, we'll simulate the data fetching with async functions.
// This allows us to build the frontend as if we're talking to a real database.

const AVAILABLE_VOICES: Voice[] = [
    { name: 'Zephyr', region: 'Standard American' },
    { name: 'Puck', region: 'British English' },
    { name: 'Charon', region: 'Australian Accent' },
    { name: 'Kore', region: 'Friendly US-West' },
    { name: 'Fenrir', region: 'Deep US-South' },
];

const MOCK_TEACHERS: Teacher[] = [
  {
    id: 'scientist',
    name: 'Dr. Axiom',
    avatar: ScientistAvatar,
    description: 'Specializes in physics, chemistry, and biology.',
    systemInstruction: `You are Dr. Axiom, a friendly and enthusiastic scientist. Explain complex topics simply.
    You have special abilities to draw on the blackboard and highlight text.
    - To draw, embed this command: [DRAW:SHAPE color=tailwind-color x=val y=val ...] where SHAPE is RECT, CIRCLE, or LINE. Coordinates and dimensions (w, h, r, x1, y1, x2, y2) are percentages from 0-100. Example: [DRAW:CIRCLE color=blue-300 x=50 y=50 r=20]
    - To highlight, embed this command: [HIGHLIGHT:text to highlight]. Example: The key part is the [HIGHLIGHT:mitochondria].
    - Proactively use drawings for diagrams (e.g., atoms, cells, planets) and highlighting for key terms.
    - When a new, visual-heavy topic like "the solar system" or "volcanoes" is introduced, proactively use the 'search_videos' or 'search_youtube' tool to find a relevant video to display on the blackboard. You are speaking to a student in a virtual call.`,
    color: 'blue',
    voice: AVAILABLE_VOICES[0],
    availableVoices: AVAILABLE_VOICES,
  },
  {
    id: 'artist',
    name: 'Seraphina',
    avatar: ArtistAvatar,
    description: 'An expert in art history, techniques, and creative thinking.',
    systemInstruction: `You are Seraphina, a passionate and imaginative art mentor. Encourage creativity.
    - To draw, embed this command: [DRAW:SHAPE color=tailwind-color x=val y=val ...] where SHAPE is RECT, CIRCLE, or LINE. Coordinates and dimensions (w, h, r, x1, y1, x2, y2) are percentages from 0-100. Example: [DRAW:RECT color=purple-300 x=10 y=10 w=80 h=40]
    - To highlight, embed this command: [HIGHLIGHT:text to highlight]. Example: This demonstrates the [HIGHLIGHT:rule of thirds].
    - Use drawing to illustrate composition, perspective lines, or color palettes.
    - When discussing art movements or techniques, proactively use the 'search_videos' or 'search_youtube' tool to show examples. You are speaking to a student in a virtual call.`,
    color: 'purple',
    voice: AVAILABLE_VOICES[3],
    availableVoices: AVAILABLE_VOICES,
  },
  {
    id: 'historian',
    name: 'Professor Quill',
    avatar: HistorianAvatar,
    description: 'A knowledgeable historian who brings the past to life.',
    systemInstruction: `You are Professor Quill, a wise historian. Weave facts into a compelling story.
    - To draw, embed this command: [DRAW:SHAPE color=tailwind-color x=val y=val ...] where SHAPE is RECT, CIRCLE, or LINE. Coordinates and dimensions (w, h, r, x1, y1, x2, y2) are percentages from 0-100. Example: [DRAW:LINE color=orange-300 x1=10 y1=50 x2=90 y2=50]
    - To highlight, embed this command: [HIGHLIGHT:text to highlight]. Example: The treaty was signed in [HIGHLIGHT:1918].
    - Use drawing to create simple timelines or maps to illustrate your points.
    - When you encounter a difficult historical name or term, use the 'speak_term' tool to pronounce it clearly. When describing historical events or locations, proactively use 'search_youtube' for educational videos or 'search_videos' for general footage. You are speaking to a student in a virtual call.`,
    color: 'orange',
    voice: AVAILABLE_VOICES[1],
    availableVoices: AVAILABLE_VOICES,
  }
];

const MOCK_USERS: Record<UserRole, User> = {
    [UserRole.STUDENT]: { id: 'student1', name: 'Alex', role: UserRole.STUDENT, avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=128' },
    [UserRole.TEACHER]: { id: 'teacher1', name: 'Dr. Evelyn Reed', role: UserRole.TEACHER, avatarUrl: null },
    [UserRole.MANAGEMENT]: { id: 'mgmt1', name: 'Dr. Evans', role: UserRole.MANAGEMENT, avatarUrl: null },
    [UserRole.ADVERTISER]: { id: 'adv1', name: 'John', role: UserRole.ADVERTISER, avatarUrl: null },
};

const MOCK_EXPERTS: SubjectExpert[] = [
  { id: 'exp1', name: 'Dr. Evelyn Reed', avatar: ScientistAvatar, subject: 'Quantum Physics', status: ExpertStatus.ONLINE },
  { id: 'exp2', name: 'Marco Verratti', avatar: ArtistAvatar, subject: 'Renaissance Art', status: ExpertStatus.ONLINE },
  { id: 'exp3', name: 'Kenji Tanaka', avatar: HistorianAvatar, subject: 'Feudal Japan', status: ExpertStatus.OFFLINE },
  { id: 'exp4', name: 'Dr. Aisha Khan', avatar: ScientistAvatar, subject: 'Organic Chemistry', status: ExpertStatus.ONLINE },
  { id: 'exp5', name: 'Isabella Rossi', avatar: ArtistAvatar, subject: 'Abstract Expressionism', status: ExpertStatus.OFFLINE },
];

const MOCK_TEAM: TeamMember[] = [
    { id: 'tm1', name: 'Dr. Aris Thorne', title: 'Founder & CEO', bio: 'Visionary leader with a passion for leveraging AI to democratize education for all.', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300' },
    { id: 'tm2', name: 'Jian Li', title: 'Head of Engineering', bio: 'Expert in machine learning and scalable systems, leading our technical innovation.', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300' },
    { id: 'tm3', name: 'Priya Sharma', title: 'Lead UX Designer', bio: 'Crafts intuitive and engaging learning experiences, putting students first.', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300' },
    { id: 'tm4', name: 'Samuel Jones', title: 'Head of Curriculum', bio: 'Bridges the gap between pedagogy and technology to create effective AI tutors.', imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300' },
];

const MOCK_GROUPS: Group[] = [
    { 
        id: 'grp1', 
        name: 'Physics Study Group', 
        description: 'Collaborating on all things physics, from mechanics to quantum.', 
        members: [MOCK_USERS.STUDENT, {id: 'user2', name: 'Jane Doe', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=128'}],
        chatHistory: [
            { id: 'msg1', authorId: 'user2', authorName: 'Jane Doe', authorAvatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=128', text: "Hey everyone! Who's ready to tackle chapter 5?", timestamp: '10:30 AM' },
            { id: 'msg2', authorId: MOCK_USERS.STUDENT.id, authorName: MOCK_USERS.STUDENT.name, authorAvatarUrl: MOCK_USERS.STUDENT.avatarUrl, text: "I am! That section on special relativity is a bit confusing though.", timestamp: '10:31 AM' },
        ]
    },
    { 
        id: 'grp2', 
        name: 'Art History Enthusiasts', 
        description: 'Discussing art movements, from Renaissance to Modernism.', 
        members: [{id: 'user3', name: 'Kenji T.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128'}],
        chatHistory: [] 
    },
];

// --- MOCK DATABASE FOR SESSIONS ---
const MOCK_SESSIONS_DB: Record<string, Session[]> = {
    'student1': [
        {
            id: 'session-1',
            teacherName: 'Dr. Axiom',
            teacherAvatar: ScientistAvatar,
            teacherColor: 'blue',
            date: new Date(Date.now() - 86400000).toLocaleString(), // 1 day ago
            transcript: [
// Fix: Use TranscriptAuthor enum for type safety.
                { author: TranscriptAuthor.USER, text: 'Can you explain black holes?', timestamp: '2:30 PM'},
// Fix: Use TranscriptAuthor enum for type safety.
                { author: TranscriptAuthor.AI, text: 'Of course! A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape from it.', timestamp: '2:31 PM'},
            ],
            voice: AVAILABLE_VOICES[0],
            availableVoices: AVAILABLE_VOICES,
        },
        {
            id: 'session-2',
            teacherName: 'Seraphina',
            teacherAvatar: ArtistAvatar,
            teacherColor: 'purple',
            date: new Date(Date.now() - 172800000).toLocaleString(), // 2 days ago
            transcript: [
// Fix: Use TranscriptAuthor enum for type safety.
                { author: TranscriptAuthor.USER, text: "What's the difference between impressionism and post-impressionism?", timestamp: '11:00 AM'},
// Fix: Use TranscriptAuthor enum for type safety.
                { author: TranscriptAuthor.AI, text: "A great question! While Post-Impressionism grew out of Impressionism, it rejected its limitations. Impressionists focused on capturing the fleeting moment and the play of light, whereas Post-Impressionists were more interested in expressing emotions and symbolic meaning.", timestamp: '11:01 AM'},
            ],
            voice: AVAILABLE_VOICES[3],
            availableVoices: AVAILABLE_VOICES,
        }
    ]
};


const simulateNetworkDelay = <T>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(data);
        }, 300); // 300ms delay
    });
};

// --- DATA FETCHING FUNCTIONS ---

export const getTeachers = async (): Promise<Teacher[]> => {
    return simulateNetworkDelay(MOCK_TEACHERS);
};

export const getUsers = async (): Promise<Record<UserRole, User>> => {
    return simulateNetworkDelay(MOCK_USERS);
};

export const getExperts = async (): Promise<SubjectExpert[]> => {
    return simulateNetworkDelay(MOCK_EXPERTS);
};

export const getTeamMembers = async (): Promise<TeamMember[]> => {
    return simulateNetworkDelay(MOCK_TEAM);
};

export const getGroups = async (): Promise<Group[]> => {
    return simulateNetworkDelay(MOCK_GROUPS);
};

// --- SESSION DATABASE FUNCTIONS ---
export const getSessionsForUser = async (userId: string): Promise<Session[]> => {
    console.log(`Fetching sessions for user: ${userId}`);
    const sessions = MOCK_SESSIONS_DB[userId] || [];
    return simulateNetworkDelay([...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
};

export const saveSessionForUser = async (userId: string, session: Session): Promise<boolean> => {
    console.log(`Saving session for user: ${userId}`);
    if (!MOCK_SESSIONS_DB[userId]) {
        MOCK_SESSIONS_DB[userId] = [];
    }
    MOCK_SESSIONS_DB[userId].push(session);
    return simulateNetworkDelay(true);
};