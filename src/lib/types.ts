
export type Priority = 'low' | 'medium' | 'high';

export type Category = 'work' | 'personal' | 'health' | 'shopping' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority: Priority;
  category: Category;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byPriority: Record<Priority, number>;
  byCategory: Record<Category, number>;
}

export interface TaskAnalytics {
  weeklyCompletion: {
    date: string;
    completed: number;
    added: number;
  }[];
  productiveHours: {
    hour: number;
    count: number;
  }[];
  mostProductiveDay: string;
  completionRate: number;
  averageCompletionTime: number;
}

export interface TaskSuggestion {
  title: string;
  category: Category;
  priority: Priority;
  dueDate?: string;
  confidence: number;
}
