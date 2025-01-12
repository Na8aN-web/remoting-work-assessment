export interface Task {
  id: number;
  title: string;
  category: string;
  status: "To Do" | "In Progress" | "Completed";
  dueDate?: Date; 
}
