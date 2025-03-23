
import React, { useState } from "react";
import { Plus, X, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Priority, Category } from "@/lib/types";
import TagSuggestions from "./TagSuggestions";

interface NewTaskFormProps {
  addTask: (
    title: string,
    description: string,
    dueDate?: string,
    priority?: Priority,
    category?: Category
  ) => void;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ addTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("other");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask(
      title,
      description,
      dueDate ? format(dueDate, "yyyy-MM-dd") : undefined,
      priority,
      category
    );

    // Reset form
    setTitle("");
    setDescription("");
    setDueDate(undefined);
    setPriority("medium");
    setCategory("other");
    setIsOpen(false);
  };

  return (
    <div className="animate-fade-in">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full gap-2 add-task-button text-white hover:bg-amber-700 shadow-md transition-all duration-300 group"
        >
          <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
          <span className="font-handwritten">Add New Task</span>
        </Button>
      ) : (
        <div className="p-5 bg-white rounded-lg shadow-md animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium font-handwritten text-amber-800">New Task</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-handwritten text-base border-0 border-b focus-visible:ring-0 rounded-none bg-transparent px-0 border-amber-200 focus:border-amber-500"
              required
            />

            <TagSuggestions 
              inputText={title}
              onSelectCategory={(cat) => setCategory(cat)}
              onSelectPriority={(pri) => setPriority(pri)}
            />

            <Textarea
              placeholder="Add details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="font-handwritten resize-none min-h-[80px] border-0 border-b focus-visible:ring-0 rounded-none bg-transparent px-0 border-amber-200 focus:border-amber-500"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-amber-700 font-handwritten">
                  Due Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal task-input font-handwritten ${
                        dueDate ? "text-amber-900" : "text-amber-500"
                      }`}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-amber-700 font-handwritten">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 custom-select task-input font-handwritten"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-amber-700 font-handwritten">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 custom-select task-input font-handwritten"
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="health">Health</option>
                  <option value="shopping">Shopping</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="gap-1 task-button font-handwritten rounded-full"
                disabled={!title.trim()}
              >
                <Plus className="w-4 h-4" />
                Add Task
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewTaskForm;
