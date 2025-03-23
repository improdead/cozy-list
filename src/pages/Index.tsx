import React, { useState, useEffect } from "react";
import { useSupabaseTasks } from "@/hooks/useSupabaseTasks";
import { useTaskAnalysis } from "@/hooks/useTaskAnalysis";
import Header from "@/components/Header";
import NewTaskForm from "@/components/NewTaskForm";
import TaskList from "@/components/TaskList";
import TaskCalendar from "@/components/TaskCalendar";
import TaskAnalytics from "@/components/TaskAnalytics";
import SuggestionPanel from "@/components/SuggestionPanel";
import TaskStreak from "@/components/TaskStreak";
import { LogOut, MessageSquare, CheckCircle, Calendar, PieChart, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const {
    tasks,
    isLoading,
    addTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    clearCompletedTasks
  } = useSupabaseTasks();
  const {
    analyzeUserTasks,
    isAnalyzing,
    analysis
  } = useTaskAnalysis();
  const navigate = useNavigate();

  // Run task analysis when tasks change
  useEffect(() => {
    if (!isLoading) {
      analyzeUserTasks(tasks);
    }
  }, [tasks, isLoading]);
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error) {
      toast.error("Error signing out");
    }
  };
  const handleAddSuggestion = (suggestion: any) => {
    addTask(suggestion.title, "", suggestion.dueDate, suggestion.priority, suggestion.category);
    toast.success(`Added suggestion: ${suggestion.title}`);
  };
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
      </div>;
  }

  // Features section for the index page
  const renderFeatures = () => {
    return;
  };

  // Testimonials section
  const renderTestimonials = () => {
    return;
  };
  return <div className="min-h-screen bg-amber-50 bg-paper-texture">
      <div className="container px-4 py-8 mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/chat")} className="flex items-center gap-1 text-amber-700 hover:text-amber-900 border-amber-200">
              <MessageSquare className="w-4 h-4" /> 
              <span className="font-handwritten">Task Chat</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="flex items-center gap-1 text-amber-700 hover:text-amber-900">
              <LogOut className="w-4 h-4" /> 
              <span className="font-handwritten">Sign Out</span>
            </Button>
          </div>
        </div>

        <div className="mt-4">
          {activeTab === "tasks" && <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="lg:col-span-2 space-y-6">
                <div className="task-container">
                  <NewTaskForm addTask={addTask} />
                </div>
                
                <div className="task-container">
                  <TaskList tasks={tasks} toggleTaskCompletion={toggleTaskCompletion} updateTask={updateTask} deleteTask={deleteTask} clearCompletedTasks={clearCompletedTasks} />
                </div>

                {renderFeatures()}
                {renderTestimonials()}
              </div>
              
              <div className="space-y-6">
                <SuggestionPanel title="Smart Suggestions" summary={analysis?.summary || null} suggestions={analysis?.suggestions || []} isLoading={isAnalyzing} onAddSuggestion={handleAddSuggestion} />

                <TaskStreak tasks={tasks} />
              </div>
            </div>}

          {activeTab === "calendar" && <TaskCalendar tasks={tasks} toggleTaskCompletion={toggleTaskCompletion} updateTask={updateTask} deleteTask={deleteTask} />}

          {activeTab === "analytics" && <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
              {analysis && <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <h3 className="text-xl font-handwritten text-amber-800 mb-2">Weekly Summary</h3>
                  <p className="text-amber-700 font-handwritten">{analysis.summary}</p>
                </div>}
              <TaskAnalytics tasks={tasks} />
            </div>}
        </div>
      </div>
    </div>;
};
export default Index;