import React from 'react';

type Tab = 'chat' | 'video' | 'history' | 'goals' | 'groups';

interface TabSelectorProps {
  activeTab: Tab;
  onSelectTab: (tab: Tab) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onSelectTab }) => {
  const getButtonClasses = (tab: Tab) => {
    return `flex-1 py-3 px-4 text-center font-semibold rounded-md transition-all duration-300 text-sm ${
      activeTab === tab
        ? 'bg-indigo-600 text-white'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`;
  };

  return (
    <div className="p-2 border-b border-gray-700">
        <div className="flex gap-2 bg-gray-900/50 p-1 rounded-lg">
            <button
                onClick={() => onSelectTab('chat')}
                className={getButtonClasses('chat')}
            >
                Chat
            </button>
             <button
                onClick={() => onSelectTab('video')}
                className={getButtonClasses('video')}
            >
                Video Lab
            </button>
            <button
                onClick={() => onSelectTab('groups')}
                className={getButtonClasses('groups')}
            >
                Groups
            </button>
            <button
                onClick={() => onSelectTab('goals')}
                className={getButtonClasses('goals')}
            >
                Goals
            </button>
            <button
                onClick={() => onSelectTab('history')}
                className={getButtonClasses('history')}
            >
                History
            </button>
        </div>
    </div>
  );
};

export default TabSelector;