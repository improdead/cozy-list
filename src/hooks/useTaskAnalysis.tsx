
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskSuggestion } from "@/lib/types";
import { toast } from "sonner";

interface TaskAnalysisResult {
  summary: string;
  suggestions: TaskSuggestion[];
}

export function useTaskAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<TaskAnalysisResult | null>(null);

  const analyzeUserTasks = async (tasks: Task[]) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Only proceed if we have enough tasks
      if (!tasks || tasks.length < 1) {
        setAnalysis({
          summary: "Add more tasks to get personalized insights!",
          suggestions: []
        });
        return null;
      }

      console.log("Calling task-analysis function with", tasks.length, "tasks");
      const { data, error } = await supabase.functions.invoke('task-analysis', {
        body: { tasks },
      });

      if (error) {
        console.error("Error from Supabase function:", error);
        throw new Error(error.message);
      }
      
      if (!data) {
        throw new Error("No response from analysis function");
      }
      
      // Ensure we have valid suggestion objects
      let validatedSuggestions: TaskSuggestion[] = [];
      
      if (data.suggestions && Array.isArray(data.suggestions)) {
        validatedSuggestions = data.suggestions.map((suggestion: any) => {
          return {
            title: suggestion.title || "Task suggestion",
            category: suggestion.category || "other",
            priority: suggestion.priority || "medium",
            confidence: suggestion.confidence || 0.5,
            dueDate: suggestion.dueDate
          } as TaskSuggestion;
        });
      }
      
      const analysisResult: TaskAnalysisResult = {
        summary: data.summary || "No summary available",
        suggestions: validatedSuggestions
      };
      
      console.log("Analysis result:", analysisResult);
      setAnalysis(analysisResult);
      return analysisResult;
    } catch (err: any) {
      console.error("Error analyzing tasks:", err);
      setError(err.message || "Failed to analyze tasks");
      toast.error("Failed to analyze tasks: " + (err.message || "Unknown error"));
      
      // Set a fallback analysis with empty suggestions
      setAnalysis({
        summary: "Error analyzing tasks. Please try again later.",
        suggestions: []
      });
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeUserTasks,
    isAnalyzing,
    error,
    analysis,
  };
}
