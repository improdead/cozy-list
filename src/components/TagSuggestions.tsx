
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tag, Sparkles } from "lucide-react";
import { Priority, Category } from "@/lib/types";

interface TagSuggestionsProps {
  inputText: string;
  onSelectCategory: (category: Category) => void;
  onSelectPriority: (priority: Priority) => void;
}

const TagSuggestions: React.FC<TagSuggestionsProps> = ({
  inputText,
  onSelectCategory,
  onSelectPriority,
}) => {
  const [suggestions, setSuggestions] = useState<{
    categories: { value: Category; confidence: number }[];
    priorities: { value: Priority; confidence: number }[];
  }>({
    categories: [],
    priorities: [],
  });

  useEffect(() => {
    if (!inputText.trim()) {
      setSuggestions({ categories: [], priorities: [] });
      return;
    }

    // Simple keyword-based suggestion system
    const text = inputText.toLowerCase();

    // Category suggestions based on keywords
    const categoryMatches: { value: Category; confidence: number }[] = [];
    
    // Work category keywords
    if (text.match(/\b(work|job|meeting|client|project|deadline|report|presentation|email|office|boss|colleague|task|assignment)\b/)) {
      categoryMatches.push({ value: "work", confidence: 0.8 });
    }
    
    // Personal category keywords
    if (text.match(/\b(personal|home|family|friend|visit|social|hobby|leisure|vacation|trip|party|birthday|call|chat)\b/)) {
      categoryMatches.push({ value: "personal", confidence: 0.8 });
    }
    
    // Health category keywords
    if (text.match(/\b(health|doctor|gym|workout|exercise|run|jog|walk|medicine|drug|pill|appointment|therapy|mental|physical|yoga|meditation|fitness)\b/)) {
      categoryMatches.push({ value: "health", confidence: 0.8 });
    }
    
    // Shopping category keywords
    if (text.match(/\b(shop|buy|purchase|store|mall|grocery|food|order|online|amazon|item|product|clothes|goods)\b/)) {
      categoryMatches.push({ value: "shopping", confidence: 0.8 });
    }

    // Priority suggestions based on keywords
    const priorityMatches: { value: Priority; confidence: number }[] = [];
    
    // High priority keywords
    if (text.match(/\b(urgent|asap|important|critical|high|crucial|emergency|immediately|deadline|due|today|tomorrow|soon)\b/)) {
      priorityMatches.push({ value: "high", confidence: 0.8 });
    }
    
    // Medium priority keywords
    if (text.match(/\b(moderate|medium|normal|regular|standard|average|typical|this week|next week)\b/)) {
      priorityMatches.push({ value: "medium", confidence: 0.8 });
    }
    
    // Low priority keywords
    if (text.match(/\b(low|minor|trivial|eventually|sometime|when possible|no rush|can wait|optional|later|next month)\b/)) {
      priorityMatches.push({ value: "low", confidence: 0.8 });
    }

    setSuggestions({
      categories: categoryMatches,
      priorities: priorityMatches,
    });
  }, [inputText]);

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case "work":
        return "bg-purple-100 text-purple-600 hover:bg-purple-200 border-purple-200";
      case "personal":
        return "bg-pink-100 text-pink-600 hover:bg-pink-200 border-pink-200";
      case "health":
        return "bg-green-100 text-green-600 hover:bg-green-200 border-green-200";
      case "shopping":
        return "bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-200";
      default:
        return "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200";
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600 hover:bg-red-200 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-600 hover:bg-blue-200 border-blue-200";
      default:
        return "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200";
    }
  };

  const hasSuggestions = suggestions.categories.length > 0 || suggestions.priorities.length > 0;

  if (!hasSuggestions) {
    return null;
  }

  return (
    <div className="mt-2 animate-fade-in">
      {suggestions.categories.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center text-xs text-amber-600 mb-1">
            <Sparkles className="w-3 h-3 mr-1" />
            <span className="font-handwritten">Suggested Categories:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {suggestions.categories.map((cat, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`cursor-pointer ${getCategoryColor(cat.value)}`}
                onClick={() => onSelectCategory(cat.value)}
              >
                <Tag className="w-3 h-3 mr-1" />
                {cat.value}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {suggestions.priorities.length > 0 && (
        <div>
          <div className="flex items-center text-xs text-amber-600 mb-1">
            <Sparkles className="w-3 h-3 mr-1" />
            <span className="font-handwritten">Suggested Priorities:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {suggestions.priorities.map((pri, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`cursor-pointer ${getPriorityColor(pri.value)}`}
                onClick={() => onSelectPriority(pri.value)}
              >
                {pri.value}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSuggestions;
