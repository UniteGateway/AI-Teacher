import React, { useState, useMemo } from 'react';
import { LearningGoal, GoalStatus } from '../types';

interface GoalItemProps {
    goal: LearningGoal;
    onUpdate: (id: string, status: GoalStatus) => void;
    onDelete: (id: string) => void;
    onDiscuss: (text: string) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onUpdate, onDelete, onDiscuss }) => {
    return (
        <div className="bg-gray-900/50 p-3 rounded-lg flex items-center justify-between gap-2 border border-gray-700/50 hover:border-gray-600 transition-colors">
            <p className="text-gray-200 text-sm flex-1">{goal.text}</p>
            <div className="flex items-center gap-1">
                {goal.status === GoalStatus.TODO && (
                    <button onClick={() => onUpdate(goal.id, GoalStatus.IN_PROGRESS)} title="Start Goal" className="p-1.5 text-gray-400 hover:text-green-400 rounded-full hover:bg-green-500/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </button>
                )}
                {goal.status === GoalStatus.IN_PROGRESS && (
                    <button onClick={() => onUpdate(goal.id, GoalStatus.COMPLETED)} title="Complete Goal" className="p-1.5 text-gray-400 hover:text-blue-400 rounded-full hover:bg-blue-500/10 transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </button>
                )}
                 <button onClick={() => onDiscuss(goal.text)} title="Discuss with Tutor" className="p-1.5 text-gray-400 hover:text-indigo-400 rounded-full hover:bg-indigo-500/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>
                <button onClick={() => onDelete(goal.id)} title="Delete Goal" className="p-1.5 text-gray-400 hover:text-red-400 rounded-full hover:bg-red-500/10 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        </div>
    );
};

interface GoalColumnProps {
    status: GoalStatus;
    goals: LearningGoal[];
    children: (goal: LearningGoal) => React.ReactNode;
}

const GoalColumn: React.FC<GoalColumnProps> = ({ status, goals, children }) => {
    const statusConfig = {
        [GoalStatus.TODO]: { color: 'yellow', title: 'To Do' },
        [GoalStatus.IN_PROGRESS]: { color: 'blue', title: 'In Progress' },
        [GoalStatus.COMPLETED]: { color: 'green', title: 'Completed' },
    };
    const { color, title } = statusConfig[status];
    return (
        <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider text-${color}-400 mb-3 px-1`}>{title} ({goals.length})</h3>
            <div className="space-y-2">
                {goals.length > 0 ? goals.map(g => children(g)) : <p className="text-xs text-gray-500 px-1">No goals yet.</p>}
            </div>
        </div>
    )
}

interface LearningGoalsProps {
  goals: LearningGoal[];
  onAddGoal: (text: string) => void;
  onUpdateGoalStatus: (id: string, status: GoalStatus) => void;
  onDeleteGoal: (id: string) => void;
  onDiscussGoal: (text: string) => void;
}

const LearningGoals: React.FC<LearningGoalsProps> = ({ goals, onAddGoal, onUpdateGoalStatus, onDeleteGoal, onDiscussGoal }) => {
    const [newGoalText, setNewGoalText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoalText.trim()) {
            onAddGoal(newGoalText.trim());
            setNewGoalText('');
        }
    };
    
    const goalsByStatus = useMemo(() => ({
        [GoalStatus.TODO]: goals.filter(g => g.status === GoalStatus.TODO),
        [GoalStatus.IN_PROGRESS]: goals.filter(g => g.status === GoalStatus.IN_PROGRESS),
        [GoalStatus.COMPLETED]: goals.filter(g => g.status === GoalStatus.COMPLETED),
    }), [goals]);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                        placeholder="Add a new learning goal..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 rounded-md p-2 text-white transition-colors" disabled={!newGoalText.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                </form>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-6">
                <GoalColumn status={GoalStatus.TODO} goals={goalsByStatus[GoalStatus.TODO]}>
                    {(goal: LearningGoal) => <GoalItem key={goal.id} goal={goal} onUpdate={onUpdateGoalStatus} onDelete={onDeleteGoal} onDiscuss={onDiscussGoal} />}
                </GoalColumn>
                 <GoalColumn status={GoalStatus.IN_PROGRESS} goals={goalsByStatus[GoalStatus.IN_PROGRESS]}>
                    {(goal: LearningGoal) => <GoalItem key={goal.id} goal={goal} onUpdate={onUpdateGoalStatus} onDelete={onDeleteGoal} onDiscuss={onDiscussGoal} />}
                </GoalColumn>
                 <GoalColumn status={GoalStatus.COMPLETED} goals={goalsByStatus[GoalStatus.COMPLETED]}>
                    {(goal: LearningGoal) => <GoalItem key={goal.id} goal={goal} onUpdate={onUpdateGoalStatus} onDelete={onDeleteGoal} onDiscuss={onDiscussGoal} />}
                </GoalColumn>
            </div>
        </div>
    );
};

export default LearningGoals;