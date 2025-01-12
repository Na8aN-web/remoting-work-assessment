import React, { useState, useEffect, useRef } from 'react';
import { Task } from './types';
import { getTasks, addTask as addTaskApi, updateTask as updateTaskApi, deleteTask as deleteTaskApi } from './services/api';
import Kanban from './components/Kanban';
import CalendarView from './components/CalendarView';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ProgressBar from './components/ProgressBar';
import { Moon, Sun } from 'lucide-react';
import { DropResult } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setFilterCategory,
  setSearchQuery,
  setDarkMode,
  setEditingTask,
} from './store/taskSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    tasks,
    filterCategory,
    searchQuery,
    darkMode,
    editingTask,
  } = useAppSelector(state => state.tasks);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [taskStatus, setTaskStatus] = useState<'To Do' | 'In Progress' | 'Completed'>('To Do');
  const [taskDueDate, setTaskDueDate] = useState<Date | undefined>(undefined);
  const formRef = useRef<HTMLFormElement | null>(null);

 useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks();
      dispatch(setTasks(data));
    };
    fetchTasks();
  }, [dispatch]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    dispatch(setDarkMode(!darkMode));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTask) {
      const updatedTask: Task = {
        ...editingTask,
        title: taskTitle,
        category: taskCategory,
        status: taskStatus,
        dueDate: taskDueDate,
      };

      await updateTaskApi(updatedTask);
      dispatch(updateTask(updatedTask));
      dispatch(setEditingTask(null));
    } else {
      const newTask: Task = {
        id: Date.now(),
        title: taskTitle,
        category: taskCategory,
        status: taskStatus,
        dueDate: taskDueDate,
      };
      const addedTask = await addTaskApi(newTask);
      dispatch(addTask(addedTask));
    }

    setTaskTitle('');
    setTaskCategory('');
    setTaskStatus('To Do');
    setTaskDueDate(undefined);
  };

  const handleDelete = async (id: number) => {
    await deleteTaskApi(id);
    dispatch(deleteTask(id));
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceTasks = tasks.filter((task) => task.status === source.droppableId);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    const updatedTask = { ...movedTask, status: destination.droppableId as Task['status'] };

    try {
      await updateTaskApi(updatedTask);
      dispatch(updateTask(updatedTask));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleEdit = (task: Task) => {
    dispatch(setEditingTask(task));
    setTaskTitle(task.title);
    setTaskCategory(task.category);
    setTaskStatus(task.status);
    setTaskDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = filterCategory
      ? task.category.toLowerCase().includes(filterCategory.toLowerCase())
      : true;
    const matchesSearch = searchQuery
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 ">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow py-4 px-6 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold">Task Manager</h1>
        <button
          onClick={toggleDarkMode}
          className="bg-gray-800 dark:bg-gray-200 text-white dark:text-black px-4 py-2 rounded-lg transition"
        >
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-500" />
          ) : (
            <Moon className="w-6 h-6 text-white" />
          )}
        </button>
      </header>



      {/* Main Content */}
      <main className=" p-6">
        <div className="my-12">
          <ProgressBar totalTasks={totalTasks} completedTasks={completedTasks} />
        </div>

        {/* Task Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={`mb-6 p-6 rounded shadow-lg ${editingTask ? "bg-yellow-100 dark:bg-yellow-800 border-2 border-yellow-500" : "bg-white dark:bg-gray-800"
            }`}
        >
          {editingTask && (
            <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 rounded">
              Editing Task: <strong>{editingTask.title}</strong>
            </div>
          )}
          <div className="flex md:flex-row flex-wrap flex-col gap-4">
            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-700"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
              className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-700"
              required
            />
            <div className="flex flex-col">
              {/* Label for Task Status */}
              <label htmlFor="taskStatus" className="text-sm font-medium  mb-1 text-gray-700 dark:text-gray-100">
                Urgency
              </label>
              <select
                id="taskStatus"
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value as Task["status"])}
                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
              >
                <option value="" disabled>
                  Select Urgency
                </option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex flex-col">
              {/* Label for Due Date */}
              <label htmlFor="dueDate" className="text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={
                  taskDueDate instanceof Date && !isNaN(taskDueDate.getTime())
                    ? taskDueDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setTaskDueDate(e.target.value ? new Date(e.target.value) : undefined)}
                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              {editingTask ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by Title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 border rounded-lg w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Filter by Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-3 border rounded-lg w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Kanban */}
        <Kanban tasks={filteredTasks} onDragEnd={handleDragEnd} />

        {/* Task List */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-100">All Tasks</h2>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 p-4 mb-4 rounded-lg shadow-lg flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div>
                <h3 className="font-bold">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.category}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(task)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar View */}
        <CalendarView tasks={filteredTasks} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 dark:bg-gray-700 py-4 px-6 text-center">
        <p className="text-sm text-gray-500">Task Manager &copy; 2025</p>
      </footer>
    </div>
  );
};

export default App;
