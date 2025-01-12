import React from "react";

interface ProgressBarProps {
  totalTasks: number;
  completedTasks: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ totalTasks, completedTasks }) => {
  const completionRate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  return (
    <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-4 mt-6">
      <div
        className="bg-gradient-to-r from-blue-500 to-teal-400 h-4 rounded-full transition-all"
        style={{ width: `${completionRate}%` }}
      ></div>
      <p className="text-sm text-center mt-2 text-gray-700 dark:text-gray-300">
        {completedTasks}/{totalTasks} Tasks Completed
      </p>
    </div>
  );
};

export default ProgressBar;
