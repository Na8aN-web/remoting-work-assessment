import React, { useState, useEffect } from "react";
import { Task } from "../types";
import { getTasks, deleteTask } from "../services/api";

interface TaskListProps {
  onEdit: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onEdit }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 mb-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {task.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{task.category}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onEdit(task)}
              className="text-blue-500 hover:text-blue-700 transition duration-200 ease-in-out"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(task.id)}
              className="text-red-500 hover:text-red-700 transition duration-200 ease-in-out"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
