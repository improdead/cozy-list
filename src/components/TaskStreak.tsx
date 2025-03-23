
import React from "react";
import { Task } from "@/lib/types";
import { format, isSameDay, subDays, isAfter } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Flame, Zap } from "lucide-react";

interface TaskStreakProps {
  tasks: Task[];
}

const TaskStreak: React.FC<TaskStreakProps> = ({ tasks }) => {
  // Get repeating tasks based on title similarity
  const getRepeatingTasks = () => {
    const tasksByTitle: { [key: string]: Task[] } = {};
    
    tasks.forEach(task => {
      const simplifiedTitle = task.title.toLowerCase().trim();
      if (!tasksByTitle[simplifiedTitle]) {
        tasksByTitle[simplifiedTitle] = [];
      }
      tasksByTitle[simplifiedTitle].push(task);
    });
    
    // Filter out tasks that appear at least 2 times
    return Object.entries(tasksByTitle)
      .filter(([_, tasks]) => tasks.length >= 2)
      .map(([title, tasks]) => {
        const sortedTasks = [...tasks].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        // Calculate streak (consecutive days)
        let streak = 0;
        let missedDays = 0;
        let lastDate = new Date();
        
        sortedTasks.forEach(task => {
          const taskDate = new Date(task.createdAt);
          if (isSameDay(lastDate, taskDate) || isSameDay(lastDate, subDays(taskDate, 1))) {
            streak++;
          } else if (isAfter(lastDate, taskDate)) {
            missedDays++;
          }
          lastDate = taskDate;
        });
        
        const category = tasks[0].category;
        const iconColor = getCategoryColorClass(category);
        
        return {
          title,
          tasks: sortedTasks,
          streak,
          missedDays,
          category,
          iconColor
        };
      })
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 6); // Show top 6 streaks
  };
  
  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case 'work': return 'bg-purple-100 text-purple-600';
      case 'personal': return 'bg-pink-100 text-pink-600';
      case 'health': return 'bg-green-100 text-green-600';
      case 'shopping': return 'bg-orange-100 text-orange-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  const getIconBackgroundColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-purple-200';
      case 'personal': return 'bg-pink-200';
      case 'health': return 'bg-green-200';
      case 'shopping': return 'bg-orange-200';
      default: return 'bg-blue-200';
    }
  };

  // Generate streak data for UI
  const streakData = getRepeatingTasks();
  
  // Generate week view
  const generateWeekView = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayTasks = tasks.filter(task => 
        task.dueDate && isSameDay(new Date(task.dueDate), date) && task.completed
      );
      
      days.push({
        date,
        day: format(date, 'EEE'),
        dayOfMonth: format(date, 'd'),
        completed: dayTasks.length > 0,
        partial: dayTasks.length > 0 && dayTasks.some(task => !task.completed)
      });
    }
    
    return days;
  };
  
  const weekView = generateWeekView();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-handwritten text-amber-800 mb-3">This Week's Progress</h3>
        <div className="flex justify-between mb-6">
          {weekView.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-sm text-amber-700">{day.day}</div>
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center mt-1 border-2 ${
                  day.completed 
                    ? 'bg-blue-500 border-blue-600 text-white' 
                    : day.partial 
                      ? 'bg-blue-200 border-blue-300 text-blue-800'
                      : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}
              >
                {day.completed ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  day.dayOfMonth
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-handwritten text-amber-800 mb-3">Your Habit Streaks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {streakData.length > 0 ? (
            streakData.map((streak, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-lg border border-amber-100 shadow-sm">
                <div className={`w-10 h-10 ${getIconBackgroundColor(streak.category)} rounded-full flex items-center justify-center mr-3`}>
                  {streak.category === 'health' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L9 6.3l-2.75-2.75a6 6 0 0 0-8.49 8.49L9 23.28l11.24-11.04z" fill="currentColor"/>
                    </svg>
                  )}
                  {streak.category === 'work' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="currentColor"/>
                    </svg>
                  )}
                  {streak.category === 'personal' && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="currentColor"/>
                    </svg>
                  )}
                  {(streak.category === 'shopping' || streak.category === 'other') && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium font-handwritten text-amber-900 truncate">{streak.title}</h4>
                  <div className="flex items-center mt-1">
                    <Badge className="mr-2 bg-blue-100 text-blue-600 hover:bg-blue-200">
                      <Zap className="w-3 h-3 mr-1" /> 
                      {streak.streak} Days
                    </Badge>
                    {streak.missedDays > 0 && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100">
                        <Flame className="w-3 h-3 mr-1" /> 
                        {streak.missedDays} Missed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center p-6 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-amber-700 font-handwritten">Complete tasks regularly to build streaks!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskStreak;
