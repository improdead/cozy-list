import React, { useState, useRef, useEffect } from "react";
import { useSupabaseTasks } from "@/hooks/useSupabaseTasks";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sparkles, ArrowLeft, Send, Calendar, PlusCircle } from "lucide-react";
import { Task } from "@/lib/types";
import { format, isValid, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

// Message types
type MessageType = "user" | "ai" | "system" | "task-suggestion";

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  taskSuggestion?: {
    title: string;
    dueDate?: string;
    priority: "low" | "medium" | "high";
    category: "work" | "personal" | "health" | "shopping" | "other";
  };
}

// Generate ID for messages
const generateId = () => Math.random().toString(36).substring(2, 10);

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { tasks, addTask } = useSupabaseTasks();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: generateId(),
        type: "ai",
        content: "👋 Hello! I'm your task assistant. You can ask me about your tasks or create new ones by chatting with me.",
        timestamp: new Date()
      },
      {
        id: generateId(),
        type: "system",
        content: "Try asking things like:",
        timestamp: new Date()
      },
      {
        id: generateId(),
        type: "system",
        content: "• What tasks do I have today?",
        timestamp: new Date()
      },
      {
        id: generateId(),
        type: "system",
        content: "• I need to finish my project report by Friday",
        timestamp: new Date()
      },
      {
        id: generateId(),
        type: "system",
        content: "• What health-related tasks do I have?",
        timestamp: new Date()
      }
    ]);
    
    // Focus the input field when the component mounts
    inputRef.current?.focus();
  }, []);

  const handleCreateTask = async (taskSuggestion: any) => {
    try {
      // Call Supabase Edge Function for task enhancement
      const { data: enhancementData, error: enhancementError } = await supabase.functions.invoke('task-analysis', {
        body: {
          type: "enhance-task",
          task: {
            title: taskSuggestion.title,
            category: taskSuggestion.category,
            priority: taskSuggestion.priority,
            dueDate: taskSuggestion.dueDate || 'Not specified'
          }
        }
      });

      if (enhancementError) throw enhancementError;

      const aiSuggestions = enhancementData.suggestions;

      // Add the task with AI-enhanced details
      addTask(
        taskSuggestion.title,
        aiSuggestions, // Use AI-generated description
        taskSuggestion.dueDate,
        taskSuggestion.priority,
        taskSuggestion.category
      );

      setMessages(prev => [
        ...prev,
        {
          id: generateId(),
          type: "system",
          content: `✅ Task added: "${taskSuggestion.title}"`,
          timestamp: new Date()
        },
        {
          id: generateId(),
          type: "ai",
          content: `I've enhanced your task with some details:\n\n${aiSuggestions}`,
          timestamp: new Date()
        }
      ]);

      toast.success(`Task added: ${taskSuggestion.title}`);
    } catch (error) {
      console.error("Error enhancing task:", error);
      // Fallback to basic task creation
      addTask(
        taskSuggestion.title,
        "",
        taskSuggestion.dueDate,
        taskSuggestion.priority,
        taskSuggestion.category
      );
      toast.error("Added task without AI enhancement");
    }
  };

  const findTasksByQuery = (query: string) => {
    const queryLower = query.toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = format(today, 'yyyy-MM-dd');
    
    // Match for date queries
    const dateRegex = /(?:on|for|by)\s+([a-zA-Z]+\s+\d{1,2}(?:st|nd|rd|th)?|\d{1,2}(?:st|nd|rd|th)?\s+[a-zA-Z]+)/i;
    const dateMatch = query.match(dateRegex);
    let filteredTasks = [...tasks];
    
    if (dateMatch) {
      // Very simple date parsing - in a real app you would use a more robust solution
      const dateStr = dateMatch[1];
      filteredTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        return task.dueDate.includes(dateStr) || format(new Date(task.dueDate), 'MMMM d').toLowerCase().includes(dateStr.toLowerCase());
      });
    } 
    // Handle "today" queries
    else if (queryLower.includes("today")) {
      filteredTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        return task.dueDate.startsWith(todayStr);
      });
    }
    // Handle category queries
    else if (queryLower.includes("work")) {
      filteredTasks = tasks.filter(task => task.category === "work");
    }
    else if (queryLower.includes("personal")) {
      filteredTasks = tasks.filter(task => task.category === "personal");
    }
    else if (queryLower.includes("health")) {
      filteredTasks = tasks.filter(task => task.category === "health");
    }
    else if (queryLower.includes("shopping")) {
      filteredTasks = tasks.filter(task => task.category === "shopping");
    }
    // Handle completed/uncompleted queries
    else if (queryLower.includes("completed")) {
      filteredTasks = tasks.filter(task => task.completed);
    }
    else if (queryLower.includes("uncompleted") || queryLower.includes("incomplete") || queryLower.includes("not completed")) {
      filteredTasks = tasks.filter(task => !task.completed);
    }
    
    return filteredTasks;
  };

  const parseTaskFromMessage = (message: string): { 
    isTaskCreation: boolean, 
    task: any 
  } => {
    // Regex patterns to extract task details
    const hasPriority = /\b(high|medium|low)\s+priority\b/i.test(message);
    const hasDeadline = /\b(by|on|due|before)\b/i.test(message);
    const hasAction = /\b(need to|have to|must|should|want to|going to)\b/i.test(message);
    
    // Simple heuristic: if message has action words and deadline markers, it's likely a task
    const isTaskCreation = hasAction && (hasDeadline || hasPriority);
    
    if (!isTaskCreation) {
      return { isTaskCreation: false, task: null };
    }
    
    // Extract category
    let category: "work" | "personal" | "health" | "shopping" | "other" = "other";
    
    if (/\b(work|job|office|project|report|meeting|presentation)\b/i.test(message)) {
      category = "work";
    } else if (/\b(health|exercise|gym|workout|doctor|medical|fitness)\b/i.test(message)) {
      category = "health";
    } else if (/\b(personal|family|home|house|hobby|friend)\b/i.test(message)) {
      category = "personal";
    } else if (/\b(shop|buy|purchase|shopping|store|mall)\b/i.test(message)) {
      category = "shopping";
    }
    
    // Extract priority
    let priority: "high" | "medium" | "low" = "medium";
    if (/\bhigh priority\b/i.test(message) || /\bimportant\b/i.test(message) || /\burgent\b/i.test(message)) {
      priority = "high";
    } else if (/\blow priority\b/i.test(message) || /\bnot urgent\b/i.test(message)) {
      priority = "low";
    }
    
    // Extract date (very simple approach - would need more robust parsing in a real app)
    let dueDate: string | undefined = undefined;
    const dateRegex = /\b(by|on|due|before)\s+([a-zA-Z]+\s+\d{1,2}(?:st|nd|rd|th)?|\d{1,2}(?:st|nd|rd|th)?\s+[a-zA-Z]+)/i;
    const dateMatch = message.match(dateRegex);
    
    if (dateMatch) {
      // Super simple approach - in a real app would use a date parsing library
      const dateText = dateMatch[2].toLowerCase();
      // This is a placeholder - in a real app, you'd use a proper date parser
      const today = new Date();
      // Add 3 days as a dummy date - in a real app you'd properly parse the date
      today.setDate(today.getDate() + 3);
      dueDate = format(today, "yyyy-MM-dd");
    }
    
    // Extract the main task from the sentence
    let title = message.replace(/\b(I need to|I have to|I must|I should|I want to|I'm going to|I am going to)\b/i, "").trim();
    title = title.replace(/\b(by|on|due|before)\s+([a-zA-Z]+\s+\d{1,2}(?:st|nd|rd|th)?|\d{1,2}(?:st|nd|rd|th)?\s+[a-zA-Z]+)/i, "").trim();
    title = title.replace(/\b(high|medium|low)\s+priority\b/i, "").trim();
    
    // Clean up the title
    title = title.replace(/^(to|a|an)\s+/i, "");
    
    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);
    
    // If title ends with a period, remove it
    if (title.endsWith(".")) {
      title = title.slice(0, -1);
    }
    
    return {
      isTaskCreation: true,
      task: {
        title,
        dueDate,
        priority,
        category
      }
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: generateId(),
      type: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    
    try {
      const { isTaskCreation, task } = parseTaskFromMessage(input);
      
      if (isTaskCreation && task) {
        const suggestionMessage: Message = {
          id: generateId(),
          type: "task-suggestion",
          content: `Would you like me to add this to your tasks?`,
          timestamp: new Date(),
          taskSuggestion: {
            title: task.title,
            dueDate: task.dueDate,
            priority: task.priority,
            category: task.category
          }
        };
        
        setMessages(prev => [...prev, suggestionMessage]);
        setIsProcessing(false);
        return;
      }
      
      // Use Supabase Edge Function for chat responses
      const { data: chatData, error: chatError } = await supabase.functions.invoke('task-analysis', {
        body: {
          type: "chat",
          message: input,
          context: {
            tasks: findTasksByQuery(input),
            previousMessages: messages.slice(-5) // Send last 5 messages for context
          }
        }
      });

      if (chatError) throw chatError;

      setMessages(prev => [
        ...prev,
        {
          id: generateId(),
          type: "ai",
          content: chatData.response,
          timestamp: new Date()
        }
      ]);
      
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages(prev => [
        ...prev,
        {
          id: generateId(),
          type: "ai",
          content: "I encountered an error processing your request. Please try again.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 bg-paper-texture flex flex-col">
      <div className="container mx-auto max-w-4xl px-4 py-6 flex-1 flex flex-col">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/tasks")}
            className="mr-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-handwritten">Back to Tasks</span>
          </Button>
          <h1 className="text-2xl font-handwritten text-amber-800 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-amber-600" />
            Task Assistant
          </h1>
        </div>
        
        <Card className="flex-1 flex flex-col overflow-hidden bg-white shadow-lg border border-amber-100 rounded-xl">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-amber-100 text-amber-900' 
                        : message.type === 'system'
                        ? 'bg-gray-100 text-gray-700 text-sm italic'
                        : message.type === 'task-suggestion'
                        ? 'bg-blue-50 border border-blue-100'
                        : 'bg-white border border-amber-200 text-amber-800'
                    }`}
                  >
                    {message.type === 'task-suggestion' ? (
                      <div>
                        <p className="mb-2 font-medium">{message.content}</p>
                        <div className="p-3 bg-white rounded-md border border-amber-100 mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-amber-600" />
                            <span className="font-medium">{message.taskSuggestion?.title}</span>
                          </div>
                          {message.taskSuggestion?.dueDate && (
                            <p className="text-sm text-amber-700 mb-1">Due date: {message.taskSuggestion?.dueDate}</p>
                          )}
                          <div className="flex gap-2 mt-1">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              message.taskSuggestion?.priority === 'high' 
                                ? 'bg-red-100 text-red-600' 
                                : message.taskSuggestion?.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-blue-100 text-blue-600'
                            } font-medium`}>
                              {message.taskSuggestion?.priority}
                            </span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              message.taskSuggestion?.category === 'work' 
                                ? 'bg-purple-100 text-purple-600' 
                                : message.taskSuggestion?.category === 'personal'
                                ? 'bg-pink-100 text-pink-600'
                                : message.taskSuggestion?.category === 'health'
                                ? 'bg-green-100 text-green-600'
                                : message.taskSuggestion?.category === 'shopping'
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-gray-100 text-gray-600'
                            } font-medium`}>
                              {message.taskSuggestion?.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="default"
                            className="w-full"
                            onClick={() => handleCreateTask(message.taskSuggestion)}
                          >
                            <PlusCircle className="w-4 h-4 mr-1" /> Yes, add it
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="w-full"
                            onClick={() => {
                              setMessages(prev => [
                                ...prev, 
                                {
                                  id: generateId(),
                                  type: "system",
                                  content: "Task suggestion dismissed",
                                  timestamp: new Date()
                                }
                              ]);
                            }}
                          >
                            No, thanks
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-line">
                        {message.content.split('\n').map((text, i) => (
                          <div key={i} className={`${text.startsWith('**') && text.endsWith('**') ? 'font-bold' : ''}`}>
                            {text.startsWith('**') && text.endsWith('**') 
                              ? text.substring(2, text.length - 2) 
                              : text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-white border border-amber-200 max-w-[80%] rounded-lg p-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="p-3 border-t border-amber-100">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                placeholder="Ask about your tasks or add a new one..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-amber-50/50 border-amber-200 focus:border-amber-500"
                disabled={isProcessing}
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || isProcessing}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;


