
import React from "react";
import { TaskSuggestion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Plus, BrainCircuit, Sparkles } from "lucide-react";

interface SuggestionPanelProps {
  title: string;
  summary: string | null;
  suggestions: TaskSuggestion[];
  isLoading: boolean;
  onAddSuggestion: (suggestion: TaskSuggestion) => void;
}

const SuggestionPanel: React.FC<SuggestionPanelProps> = ({
  title,
  summary,
  suggestions,
  isLoading,
  onAddSuggestion
}) => {
  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-100">
      <CardHeader className="bg-amber-50 border-b border-amber-100 py-4">
        <CardTitle className="flex items-center gap-2 font-handwritten text-amber-800 text-xl">
          <Sparkles className="h-5 w-5 text-amber-600" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4"></div>
            <p className="text-amber-800 font-handwritten">Analyzing your tasks...</p>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-4">
            {summary && (
              <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 mb-4">
                <div className="flex items-start gap-2">
                  <BrainCircuit className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-handwritten text-amber-800 font-medium">Weekly Analysis</h4>
                    <p className="text-amber-700 font-handwritten text-sm mt-1">{summary}</p>
                  </div>
                </div>
              </div>
            )}
            
            <h4 className="font-handwritten text-amber-800 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              Suggested Tasks
            </h4>
            
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 border border-amber-100 rounded-lg bg-amber-50/50 hover:bg-amber-50 transition-colors group">
                <div>
                  <h4 className="font-handwritten text-amber-900">{suggestion.title}</h4>
                  <div className="flex gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      suggestion.priority === 'high' 
                        ? 'bg-red-100 text-red-600' 
                        : suggestion.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-blue-100 text-blue-600'
                    } font-medium`}>
                      {suggestion.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      suggestion.category === 'work' 
                        ? 'bg-purple-100 text-purple-600' 
                        : suggestion.category === 'personal'
                        ? 'bg-pink-100 text-pink-600'
                        : suggestion.category === 'health'
                        ? 'bg-green-100 text-green-600'
                        : suggestion.category === 'shopping'
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-gray-100 text-gray-600'
                    } font-medium`}>
                      {suggestion.category}
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="task-button h-8 rounded-full opacity-70 group-hover:opacity-100"
                  onClick={() => onAddSuggestion(suggestion)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 px-3 text-center">
            <Lightbulb className="h-10 w-10 text-amber-400/50 mx-auto mb-3" />
            <h4 className="font-handwritten text-amber-800 text-lg mb-2">No suggestions yet</h4>
            <p className="text-amber-600 font-handwritten text-sm">
              Add more tasks to get personalized suggestions!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestionPanel;
