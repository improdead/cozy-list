
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Task, Priority, Category } from "../lib/types";
import { supabase } from "@/integrations/supabase/client";

export const useSupabaseTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from Supabase on initial render
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Transform the data to match the Task type structure
          setTasks(data.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description || "",
            completed: task.completed,
            createdAt: task.created_at,
            dueDate: task.due_date || undefined,
            priority: task.priority as Priority, // Cast to Priority type
            category: task.category as Category, // Cast to Category type
          })));
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

  // Add a new task
  const addTask = async (
    title: string,
    description: string = "",
    dueDate?: string,
    priority: Priority = "medium",
    category: Category = "other"
  ) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("You must be logged in to add tasks");
        return null;
      }

      const newTask = {
        title,
        description,
        completed: false,
        due_date: dueDate,
        priority,
        category,
        user_id: userData.user.id
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();

      if (error) throw error;

      // Create a Task object from the returned data
      const createdTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || "",
        completed: data.completed,
        createdAt: data.created_at,
        dueDate: data.due_date || undefined,
        priority: data.priority as Priority,
        category: data.category as Category
      };

      setTasks(prevTasks => [createdTask, ...prevTasks]);
      toast.success("Task added successfully");
      return createdTask;
    } catch (error: any) {
      console.error("Error adding task:", error);
      toast.error(error.message || "Failed to add task");
      return null;
    }
  };

  // Update an existing task
  const updateTask = async (updatedTask: Task) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("You must be logged in to update tasks");
        return;
      }

      // Convert from our Task type to Supabase schema
      const task = {
        title: updatedTask.title,
        description: updatedTask.description,
        completed: updatedTask.completed,
        due_date: updatedTask.dueDate,
        priority: updatedTask.priority,
        category: updatedTask.category,
      };

      const { error } = await supabase
        .from('tasks')
        .update(task)
        .eq('id', updatedTask.id);

      if (error) throw error;

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      toast.success("Task updated successfully");
    } catch (error: any) {
      console.error("Error updating task:", error);
      toast.error(error.message || "Failed to update task");
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      const { error } = await supabase
        .from('tasks')
        .update({ completed: !taskToUpdate.completed })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error: any) {
      console.error("Error toggling task completion:", error);
      toast.error(error.message || "Failed to update task");
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error: any) {
      console.error("Error deleting task:", error);
      toast.error(error.message || "Failed to delete task");
    }
  };

  // Clear all completed tasks
  const clearCompletedTasks = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('completed', true);

      if (error) throw error;

      setTasks(prevTasks => prevTasks.filter(task => !task.completed));
      toast.success("Completed tasks cleared");
    } catch (error: any) {
      console.error("Error clearing completed tasks:", error);
      toast.error(error.message || "Failed to clear completed tasks");
    }
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
