
import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/lib/types";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfWeek, endOfWeek, addDays, parse, isWithinInterval, getHours, getMinutes, startOfDay, endOfDay, setHours, setMinutes } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, Calendar as CalendarLogoIcon, Clock, Grid3X3 } from "lucide-react";
import TaskItem from "./TaskItem";
import { Button } from "./ui/button";
import TaskStreak from "./TaskStreak";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface TaskCalendarProps {
  tasks: Task[];
  toggleTaskCompletion: (id: string) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
}

// Time slots for the day view
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i);

const TaskCalendar: React.FC<TaskCalendarProps> = ({
  tasks,
  toggleTaskCompletion,
  updateTask,
  deleteTask,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };

  // Get tasks for a date-time range
  const getTasksForInterval = (start: Date, end: Date) => {
    return tasks.filter((task) => 
      task.dueDate && isWithinInterval(new Date(task.dueDate), { start, end })
    );
  };

  // Count tasks for a specific date
  const countTasksForDate = (date: Date) => {
    return getTasksForDate(date).length;
  };

  // Get current week dates
  const weekDates = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start week on Monday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  // Get all days with tasks for the current month view
  const getDaysWithTasks = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start, end });
    
    return daysInMonth.filter(day => countTasksForDate(day) > 0);
  };

  // Navigate to previous month or week depending on view
  const goToPrevious = () => {
    if (view === "month") {
      setCurrentMonth(prev => subMonths(prev, 1));
    } else if (view === "week") {
      setSelectedDate(prev => addDays(prev, -7));
    } else {
      setSelectedDate(prev => addDays(prev, -1));
    }
  };

  // Navigate to next month or week depending on view
  const goToNext = () => {
    if (view === "month") {
      setCurrentMonth(prev => addMonths(prev, 1));
    } else if (view === "week") {
      setSelectedDate(prev => addDays(prev, 7));
    } else {
      setSelectedDate(prev => addDays(prev, 1));
    }
  };

  // Go to today
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
  };

  const tasksForSelectedDate = getTasksForDate(selectedDate);
  const daysWithTasks = getDaysWithTasks();

  // Get color for task category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-purple-100 text-purple-600';
      case 'personal': return 'bg-pink-100 text-pink-600';
      case 'health': return 'bg-green-100 text-green-600';
      case 'shopping': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Get color for task priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-yellow-100 text-yellow-600';
      case 'low': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Custom day component to show task indicators
  const CustomDay = (props: any) => {
    const { date, ...dayProps } = props;
    const dailyTasks = getTasksForDate(date);
    const hasTask = dailyTasks.length > 0;
    
    return (
      <div className="relative w-full h-full" {...dayProps}>
        <div className="text-center">{date.getDate()}</div>
        {hasTask && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
            {dailyTasks.slice(0, 3).map((task, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full ${task.category === 'work' ? 'bg-purple-200' : 
                  task.category === 'personal' ? 'bg-pink-200' : 
                  task.category === 'health' ? 'bg-green-200' : 
                  task.category === 'shopping' ? 'bg-orange-200' : 'bg-gray-200'}`} 
              />
            ))}
            {dailyTasks.length > 3 && (
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            )}
          </div>
        )}
      </div>
    );
  };

  // Weekly view calendar
  const renderWeeklyView = () => {
    return (
      <div className="w-full overflow-auto">
        <div className="min-w-[900px]">
          {/* Week header with day names */}
          <div className="grid grid-cols-8 border-b border-amber-100">
            <div className="h-14 flex items-center justify-center font-medium text-gray-500"></div>
            {weekDates.map((date, i) => (
              <div 
                key={i} 
                className={`h-14 flex flex-col items-center justify-center px-1 py-2 ${
                  isSameDay(date, new Date()) ? 'bg-amber-50' : ''
                }`}
              >
                <span className="text-sm text-gray-500">{format(date, 'EEE')}</span>
                <span className={`text-lg font-medium ${isSameDay(date, new Date()) ? 'text-amber-700 bg-amber-100 rounded-full h-8 w-8 flex items-center justify-center' : ''}`}>
                  {format(date, 'd')}
                </span>
              </div>
            ))}
          </div>
          
          {/* Time slots and task containers */}
          <div className="grid grid-cols-8 border-b border-amber-100">
            {/* Time indicators on the left */}
            <div className="border-r border-amber-100">
              {TIME_SLOTS.map((hour) => (
                <div key={hour} className="h-20 border-t border-amber-100 pr-2 text-right">
                  <span className="text-xs text-gray-500">{`${hour.toString().padStart(2, '0')}:00`}</span>
                </div>
              ))}
            </div>
            
            {/* Task slots for each day */}
            {weekDates.map((date, dayIndex) => (
              <div key={dayIndex} className="relative border-r border-amber-100 last:border-r-0">
                {TIME_SLOTS.map((hour) => {
                  const startTime = setHours(setMinutes(date, 0), hour);
                  const endTime = setHours(setMinutes(date, 59), hour);
                  const tasksInThisHour = getTasksForInterval(startTime, endTime);
                  
                  return (
                    <div 
                      key={hour} 
                      className={`h-20 border-t border-amber-100 p-1 ${
                        isSameDay(date, new Date()) && hour === new Date().getHours() 
                          ? 'bg-amber-50' 
                          : ''
                      }`}
                    >
                      {tasksInThisHour.map((task) => (
                        <div 
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className={`text-xs p-1 mb-1 rounded cursor-pointer truncate ${
                            getCategoryColor(task.category).split(' ')[0]
                          } hover:opacity-90 transition-opacity`}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Monthly calendar view
  const renderMonthlyView = () => {
    return (
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="rounded-md border-0"
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        showOutsideDays={true}
        components={{
          Day: CustomDay
        }}
      />
    );
  };

  // Daily view showing tasks for the selected day
  const renderDailyView = () => {
    return (
      <div className="space-y-4">
        <h3 className="font-handwritten text-lg text-amber-800 mb-2">
          Tasks for {format(selectedDate, "MMMM d, yyyy")}
        </h3>
        
        {tasksForSelectedDate.length > 0 ? (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {tasksForSelectedDate.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                toggleCompletion={toggleTaskCompletion}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 bg-amber-50 rounded-lg text-center">
            <p className="text-amber-700 font-handwritten">No tasks scheduled for this day</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 border-amber-300 bg-amber-100/50 hover:bg-amber-100 text-amber-700 font-handwritten"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg animate-fade-in">
      <div className="p-6 border-b border-amber-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CalendarLogoIcon className="h-6 w-6 text-amber-600 mr-2" />
            <h2 className="text-2xl font-bold font-handwritten text-amber-800">
              {view === "month" 
                ? format(currentMonth, "MMMM yyyy") 
                : view === "week" 
                  ? `Week of ${format(weekDates[0], "MMM d")} - ${format(weekDates[6], "MMM d, yyyy")}`
                  : format(selectedDate, "MMMM d, yyyy")}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 px-2 rounded-md border-amber-200"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4 text-amber-700" />
            </Button>
            
            <Button
              variant="outline" 
              size="sm"
              className="h-9 rounded-md border-amber-200 text-amber-700 font-handwritten"
              onClick={goToToday}
            >
              Today
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 px-2 rounded-md border-amber-200"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4 text-amber-700" />
            </Button>
            
            <div className="ml-2">
              <Button 
                variant="outline"
                size="sm"
                className="h-9 rounded-md border-amber-200 bg-amber-50"
              >
                <Plus className="h-4 w-4 text-amber-700 mr-1" />
                <span className="font-handwritten text-amber-700">Add Task</span>
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="week" className="w-full" onValueChange={(value) => setView(value as any)}>
          <div className="flex justify-between items-center">
            <TabsList className="mb-4">
              <TabsTrigger value="day" className="font-handwritten">Day</TabsTrigger>
              <TabsTrigger value="week" className="font-handwritten">Week</TabsTrigger>
              <TabsTrigger value="month" className="font-handwritten">Month</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <Grid3X3 className="h-3 w-3 mr-1" />
                Categories
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Timeline
              </Button>
            </div>
          </div>

          <TabsContent value="day" className="mt-2">
            {renderDailyView()}
          </TabsContent>

          <TabsContent value="week" className="mt-2">
            {renderWeeklyView()}
          </TabsContent>

          <TabsContent value="month" className="mt-2">
            {renderMonthlyView()}
            
            <div className="mt-6 border-t border-amber-100 pt-4">
              <h3 className="font-handwritten text-lg text-amber-800 mb-3">
                Tasks for {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              {tasksForSelectedDate.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {tasksForSelectedDate.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      toggleCompletion={toggleTaskCompletion}
                      updateTask={updateTask}
                      deleteTask={deleteTask}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-lg text-center">
                  <p className="text-amber-700 font-handwritten">No tasks scheduled for this day</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 border-amber-300 bg-amber-100/50 hover:bg-amber-100 text-amber-700 font-handwritten"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Task
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 p-6">
        <div className="md:col-span-5">
          {selectedTask && (
            <div className="bg-amber-50 rounded-lg p-4 mb-4 shadow-sm border border-amber-100">
              <div className="flex justify-between items-start">
                <h3 className="font-handwritten text-lg text-amber-800">{selectedTask.title}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  onClick={() => setSelectedTask(null)}
                >
                  ×
                </Button>
              </div>
              <p className="text-amber-700 mt-1">{selectedTask.description || "No description"}</p>
              
              <div className="flex gap-2 mt-3">
                <Badge className={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority}
                </Badge>
                <Badge className={getCategoryColor(selectedTask.category)}>
                  {selectedTask.category}
                </Badge>
                {selectedTask.dueDate && (
                  <Badge variant="outline">
                    Due: {format(new Date(selectedTask.dueDate), "MMM d, yyyy")}
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-amber-200"
                  onClick={() => toggleTaskCompletion(selectedTask.id)}
                >
                  {selectedTask.completed ? "Mark Incomplete" : "Mark Complete"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-amber-200"
                >
                  Edit
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          <Card className="border-amber-100">
            <CardContent className="p-4">
              <TaskStreak tasks={tasks} />
            </CardContent>
          </Card>

          <Card className="border-amber-100">
            <CardContent className="p-4">
              <h3 className="font-handwritten text-lg text-amber-800 mb-3">
                Upcoming Tasks
              </h3>
              <div className="space-y-2">
                {daysWithTasks.slice(0, 5).map((day) => (
                  <Popover key={day.toISOString()}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between font-handwritten border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700"
                        onClick={() => setSelectedDate(day)}
                      >
                        <span>{format(day, "MMM d")}</span>
                        <span className="flex items-center gap-1">
                          <Badge className="bg-amber-200 text-amber-700 hover:bg-amber-300">{countTasksForDate(day)}</Badge>
                          <CalendarIcon className="h-4 w-4 text-amber-400" />
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="start">
                      <div className="p-4">
                        <h4 className="font-handwritten text-lg mb-2">
                          {format(day, "MMMM d, yyyy")}
                        </h4>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {getTasksForDate(day).map((task) => (
                            <div key={task.id} className="p-2 border rounded-md border-amber-100">
                              <p className="font-medium font-handwritten">{task.title}</p>
                              <div className="flex gap-2 mt-1">
                                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)} font-medium`}>
                                  {task.priority}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(task.category)} font-medium`}>
                                  {task.category}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskCalendar;
