
import React, { useState, useMemo } from "react";
import { Search, Filter, Check, X } from "lucide-react";
import { Task } from "@/lib/types";
import { filterTasks, sortTasks } from "@/utils/taskUtils";
import TaskItem from "./TaskItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface TaskListProps {
  tasks: Task[];
  toggleTaskCompletion: (id: string) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  clearCompletedTasks: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  toggleTaskCompletion,
  updateTask,
  deleteTask,
  clearCompletedTasks,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, {
      searchQuery,
      category: categoryFilter,
      priority: priorityFilter,
      status: statusFilter,
    });
  }, [tasks, searchQuery, categoryFilter, priorityFilter, statusFilter]);

  const sortedTasks = useMemo(() => {
    return sortTasks(filteredTasks);
  }, [filteredTasks]);

  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setPriorityFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col mb-6 space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold font-handwritten">My Tasks</h2>
          <div className="flex items-center gap-1 px-2 py-1 text-xs bg-glass rounded-full">
            <span className="font-medium">{pendingCount}</span> pending, 
            <span className="font-medium">{completedCount}</span> completed
          </div>
        </div>
        
        {completedCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearCompletedTasks}
            className="gap-1 font-handnote"
          >
            <Check className="w-4 h-4" />
            Clear Completed
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 text-muted-foreground left-3 top-2.5" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-glass"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute w-6 h-6 p-1 rounded-full right-2 top-2"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button
              variant={
                categoryFilter !== "all" ||
                priorityFilter !== "all" ||
                statusFilter !== "all"
                  ? "default"
                  : "outline"
              }
              size="icon"
              className="h-10 w-10"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-4 bg-glass">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium font-handwritten text-lg">Filters</h4>
                {(categoryFilter !== "all" ||
                  priorityFilter !== "all" ||
                  statusFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-8 px-2 text-xs"
                  >
                    Reset
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Status</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-all"
                      checked={statusFilter === "all"}
                      onCheckedChange={() => setStatusFilter("all")}
                    />
                    <Label htmlFor="status-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-pending"
                      checked={statusFilter === "pending"}
                      onCheckedChange={() => setStatusFilter("pending")}
                    />
                    <Label htmlFor="status-pending">Pending</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-completed"
                      checked={statusFilter === "completed"}
                      onCheckedChange={() => setStatusFilter("completed")}
                    />
                    <Label htmlFor="status-completed">Completed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-overdue"
                      checked={statusFilter === "overdue"}
                      onCheckedChange={() => setStatusFilter("overdue")}
                    />
                    <Label htmlFor="status-overdue">Overdue</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Priority</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="priority-all"
                      checked={priorityFilter === "all"}
                      onCheckedChange={() => setPriorityFilter("all")}
                    />
                    <Label htmlFor="priority-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="priority-high"
                      checked={priorityFilter === "high"}
                      onCheckedChange={() => setPriorityFilter("high")}
                    />
                    <Label htmlFor="priority-high">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="priority-medium"
                      checked={priorityFilter === "medium"}
                      onCheckedChange={() => setPriorityFilter("medium")}
                    />
                    <Label htmlFor="priority-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="priority-low"
                      checked={priorityFilter === "low"}
                      onCheckedChange={() => setPriorityFilter("low")}
                    />
                    <Label htmlFor="priority-low">Low</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Category</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="category-all"
                      checked={categoryFilter === "all"}
                      onCheckedChange={() => setCategoryFilter("all")}
                    />
                    <Label htmlFor="category-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="category-work"
                      checked={categoryFilter === "work"}
                      onCheckedChange={() => setCategoryFilter("work")}
                    />
                    <Label htmlFor="category-work">Work</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="category-personal"
                      checked={categoryFilter === "personal"}
                      onCheckedChange={() => setCategoryFilter("personal")}
                    />
                    <Label htmlFor="category-personal">Personal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="category-health"
                      checked={categoryFilter === "health"}
                      onCheckedChange={() => setCategoryFilter("health")}
                    />
                    <Label htmlFor="category-health">Health</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="category-shopping"
                      checked={categoryFilter === "shopping"}
                      onCheckedChange={() => setCategoryFilter("shopping")}
                    />
                    <Label htmlFor="category-shopping">Shopping</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="category-other"
                      checked={categoryFilter === "other"}
                      onCheckedChange={() => setCategoryFilter("other")}
                    />
                    <Label htmlFor="category-other">Other</Label>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {sortedTasks.length > 0 ? (
        <div className="space-y-1">
          {sortedTasks.map((task) => (
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
        <div className="flex flex-col items-center justify-center p-8 text-center bg-todo-gray/30 rounded-lg animate-fade-in">
          <div className="w-16 h-16 mb-4 bg-todo-blue/30 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-medium font-handwritten">No tasks found</h3>
          <p className="text-sm text-muted-foreground">
            {tasks.length === 0
              ? "You don't have any tasks yet. Add your first task to get started!"
              : "No tasks match your current filters. Try adjusting your search or filters."}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
