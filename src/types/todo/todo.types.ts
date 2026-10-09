export type TodoPriority = 'low' | 'medium' | 'high';
export type TodoStatus = 'pending' | 'in-progress' | 'completed';

export interface DailyTodoItem {
  id: string | number;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  priority: TodoPriority;
  status: TodoStatus;
  category?: string;
  employeeId?: number;
  companyId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyTodoFilter {
  search?: string;
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
}
