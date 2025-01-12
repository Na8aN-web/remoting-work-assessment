import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../types';

interface TaskState {
  tasks: Task[];
  filterCategory: string;
  searchQuery: string;
  darkMode: boolean;
  editingTask: Task | null;
}

const initialState: TaskState = {
  tasks: [],
  filterCategory: '',
  searchQuery: '',
  darkMode: localStorage.getItem('darkMode') === 'true',
  editingTask: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    setFilterCategory: (state, action: PayloadAction<string>) => {
      state.filterCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', String(action.payload));
    },
    setEditingTask: (state, action: PayloadAction<Task | null>) => {
      state.editingTask = action.payload;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setFilterCategory,
  setSearchQuery,
  setDarkMode,
  setEditingTask,
} = taskSlice.actions;

export default taskSlice.reducer;