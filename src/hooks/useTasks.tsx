
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Task, Priority, Category } from "../lib/types";
import { generateId, getToday, getSampleTasks } from "../utils/taskUtils";

const STORAGE_KEY = "smart-todo-tasks";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const loadTasks = () => {
      try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        } else {
          // For demonstration, load sample tasks if no saved tasks exist
          setTasks(getSampleTasks());
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast.error("Failed to load your tasks");
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  // Add a new task
  const addTask = (
    title: string,
    description: string = "",
    dueDate?: string,
    priority: Priority = "medium",
    category: Category = "other"
  ) => {
    const newTask: Task = {
      id: generateId(),
      title,
      description,
      completed: false,
      createdAt: getToday(),
      dueDate,
      priority,
      category,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    toast.success("Task added successfully");
    return newTask;
  };

  // Update an existing task
  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    toast.success("Task updated successfully");
  };

  // Toggle task completion status
  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    toast.success("Task deleted successfully");
  };

  // Clear all completed tasks
  const clearCompletedTasks = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
    toast.success("Completed tasks cleared");
  };

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    clearCompletedTasks,
  };
};
