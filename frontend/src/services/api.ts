import axios from "axios";
import { Task } from "../types";

const API_URL = "https://remoting-work-assessment-ueta.vercel.app/api/tasks";
// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Add a new task
export const addTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const response = await axios.post(API_URL, task);
  return response.data;
};

//Update a task
export const updateTask = async (task: Task): Promise<Task> => {
  const response = await axios.put(`${API_URL}/${task.id}`, task);
  return response.data;
};


// Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
