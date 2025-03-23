
import { Task, TaskStats, Priority, Category } from "../lib/types";

// Generate a unique ID for new tasks
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get today's date formatted as YYYY-MM-DD
export const getToday = (): string => {
  return formatDate(new Date());
};

// Check if a task is overdue
export const isOverdue = (task: Task): boolean => {
  if (!task.dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today && !task.completed;
};

// Get tasks due today
export const getDueToday = (tasks: Task[]): Task[] => {
  const today = getToday();
  return tasks.filter(task => task.dueDate === today && !task.completed);
};

// Calculate task statistics
export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter(task => isOverdue(task)).length;
  
  // Count by priority
  const byPriority: Record<Priority, number> = {
    low: 0,
    medium: 0,
    high: 0
  };
  
  // Count by category
  const byCategory: Record<Category, number> = {
    work: 0,
    personal: 0,
    health: 0,
    shopping: 0,
    other: 0
  };
  
  // Count tasks by priority and category
  tasks.forEach(task => {
    if (!task.completed) {
      byPriority[task.priority]++;
      byCategory[task.category]++;
    }
  });
  
  return {
    total,
    completed,
    pending,
    overdue,
    byPriority,
    byCategory
  };
};

// Sort tasks by multiple criteria
export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then sort by due date (if exists)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    // Then by priority
    const priorityOrder: Record<Priority, number> = {
      high: 0,
      medium: 1,
      low: 2
    };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Finally by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

// Filter tasks by various criteria
export const filterTasks = (
  tasks: Task[], 
  { 
    searchQuery = '', 
    category = 'all', 
    priority = 'all', 
    status = 'all' 
  }: { 
    searchQuery?: string, 
    category?: string, 
    priority?: string, 
    status?: string 
  }
): Task[] => {
  return tasks.filter(task => {
    // Filter by search query
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by category
    const matchesCategory = category === 'all' || task.category === category;
    
    // Filter by priority
    const matchesPriority = priority === 'all' || task.priority === priority;
    
    // Filter by status
    const matchesStatus = 
      status === 'all' || 
      (status === 'completed' && task.completed) || 
      (status === 'pending' && !task.completed) ||
      (status === 'overdue' && isOverdue(task));
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });
};

// Group tasks by date
export const groupTasksByDate = (tasks: Task[]): Record<string, Task[]> => {
  const grouped: Record<string, Task[]> = {};
  
  tasks.forEach(task => {
    const date = task.dueDate || 'No Date';
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(task);
  });
  
  return grouped;
};

// Priority color mapping
export const getPriorityColor = (priority: Priority): string => {
  const colors: Record<Priority, string> = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low'
  };
  return colors[priority];
};

// Category color mapping
export const getCategoryColor = (category: Category): string => {
  const colors: Record<Category, string> = {
    work: 'category-work',
    personal: 'category-personal',
    health: 'category-health',
    shopping: 'category-shopping',
    other: 'accent'
  };
  return colors[category];
};

// Sample data for initial testing
export const getSampleTasks = (): Task[] => {
  const today = getToday();
  const tomorrow = formatDate(new Date(new Date().setDate(new Date().getDate() + 1)));
  const yesterday = formatDate(new Date(new Date().setDate(new Date().getDate() - 1)));
  
  return [
    {
      id: generateId(),
      title: "Complete project proposal",
      description: "Finish the draft and send it to the team for review",
      completed: false,
      createdAt: yesterday,
      dueDate: today,
      priority: "high",
      category: "work"
    },
    {
      id: generateId(),
      title: "Buy groceries",
      description: "Milk, eggs, bread, fruits",
      completed: true,
      createdAt: yesterday,
      dueDate: yesterday,
      priority: "medium",
      category: "shopping"
    },
    {
      id: generateId(),
      title: "Morning yoga session",
      description: "30 minute morning routine",
      completed: false,
      createdAt: today,
      dueDate: today,
      priority: "low",
      category: "health"
    },
    {
      id: generateId(),
      title: "Call mom",
      completed: false,
      createdAt: today,
      dueDate: tomorrow,
      priority: "medium",
      category: "personal"
    },
    {
      id: generateId(),
      title: "Review team's work",
      description: "Check progress and provide feedback",
      completed: false,
      createdAt: yesterday,
      dueDate: tomorrow,
      priority: "high",
      category: "work"
    }
  ];
};
