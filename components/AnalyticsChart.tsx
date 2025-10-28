import React from 'react';

const chartData = [
  { day: 'Mon', time: 45 },
  { day: 'Tue', time: 60 },
  { day: 'Wed', time: 30 },
  { day: 'Thu', time: 75 },
  { day: 'Fri', time: 50 },
  { day: 'Sat', time: 90 },
  { day: 'Sun', time: 20 },
];
const maxTime = 100;

const AnalyticsChart: React.FC = () => {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 shadow-lg h-full">
            <h3 className="text-lg font-bold text-white mb-4">Weekly Learning Time</h3>
            <div className="flex justify-around items-end h-48 w-full gap-2" aria-label="Chart showing learning time in minutes per day of the week">
                {chartData.map((item) => (
                    <div key={item.day} className="flex flex-col items-center flex-1 h-full" role="presentation">
                        <div className="w-full h-full flex items-end">
                             <div 
                                className="w-full bg-indigo-500 rounded-t-md hover:bg-indigo-400 transition-all duration-300 ease-in-out"
                                style={{ height: `${(item.time / maxTime) * 100}%` }}
                                title={`${item.time} minutes on ${item.day}`}
                                aria-label={`${item.time} minutes`}
                             ></div>
                        </div>
                        <span className="text-xs text-gray-400 mt-2" aria-hidden="true">{item.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsChart;
