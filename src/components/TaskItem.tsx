
import React, { useState } from "react";
import { format } from "date-fns";
import { Check, Edit2, Trash2, Clock, AlertCircle } from "lucide-react";
import { Task } from "@/lib/types";
import { isOverdue, getPriorityColor, getCategoryColor } from "@/utils/taskUtils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TaskItemProps {
  task: Task;
  toggleCompletion: (id: string) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  toggleCompletion,
  updateTask,
  deleteTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask(editedTask);
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const overdue = isOverdue(task);
  const priorityColor = getPriorityColor(task.priority);
  const categoryColor = getCategoryColor(task.category);

  return (
    <>
      <div
        className={`p-4 mb-3 paper rounded-lg transition-all duration-300 ${
          task.completed ? "opacity-70" : ""
        } animate-fade-in`}
      >
        <div className="flex items-start gap-3">
          <div 
            className={`custom-checkbox mt-1 border-${
              task.completed ? "primary" : priorityColor
            } ${task.completed ? "checked" : ""}`}
            onClick={() => toggleCompletion(task.id)}
          ></div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <h3
                className={`text-lg font-medium font-handnote leading-tight ${
                  task.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </h3>

              <div className="flex items-center gap-1">
                {!task.completed && task.dueDate && (
                  <div className="flex items-center mr-2 text-xs">
                    {overdue ? (
                      <span className="flex items-center text-destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Overdue
                      </span>
                    ) : (
                      <span className="flex items-center text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {format(new Date(task.dueDate), "MMM d")}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs bg-${categoryColor}/20 text-${categoryColor}`}>
                    {task.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs bg-${priorityColor}/20 text-${priorityColor}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>

            {task.description && (
              <p className={`text-sm mt-1 ${
                task.completed ? "text-muted-foreground" : ""
              }`}>
                {task.description}
              </p>
            )}

            <div className="flex justify-end gap-1 mt-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 rounded-full hover:bg-primary/10 hover:text-primary"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md bg-glass">
          <DialogHeader>
            <DialogTitle className="font-handwritten text-xl">Edit Task</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              className="font-handnote"
              placeholder="Task title"
              required
            />
            
            <Textarea
              name="description"
              value={editedTask.description || ""}
              onChange={handleChange}
              className="font-handnote"
              placeholder="Description (optional)"
            />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block mb-1 text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  name="dueDate"
                  value={editedTask.dueDate || ""}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Priority</label>
                <select
                  name="priority"
                  value={editedTask.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 custom-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Category</label>
                <select
                  name="category"
                  value={editedTask.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 custom-select"
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="health">Health</option>
                  <option value="shopping">Shopping</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" className="font-handnote">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-glass">
          <DialogHeader>
            <DialogTitle className="font-handwritten text-xl">Delete Task</DialogTitle>
          </DialogHeader>
          
          <p>Are you sure you want to delete this task? This action cannot be undone.</p>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="font-handnote"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteTask(task.id);
                setIsDeleteDialogOpen(false);
              }}
              className="font-handnote"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskItem;
