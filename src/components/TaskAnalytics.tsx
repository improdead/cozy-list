
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Task, TaskStats } from "@/lib/types";
import { calculateTaskStats } from "@/utils/taskUtils";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Briefcase,
  Heart,
  ShoppingBag,
  User
} from "lucide-react";

interface TaskAnalyticsProps {
  tasks: Task[];
}

const TaskAnalytics: React.FC<TaskAnalyticsProps> = ({ tasks }) => {
  const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);

  // Generate weekly data
  const weeklyData = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - i));
      return date;
    });

    return last7Days.map((date) => {
      const dateString = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      
      const completed = tasks.filter(
        (task) => 
          task.completed && 
          new Date(task.createdAt).toISOString().split("T")[0] === dateString
      ).length;
      
      const added = tasks.filter(
        (task) => new Date(task.createdAt).toISOString().split("T")[0] === dateString
      ).length;

      return {
        name: dayName,
        completed,
        added,
      };
    });
  }, [tasks]);

  // Stats cards
  const statsCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: <BarChart3 className="w-5 h-5 text-primary" />,
      description: `${stats.completed} completed, ${stats.pending} pending`,
    },
    {
      title: "Completion Rate",
      value: stats.total ? Math.round((stats.completed / stats.total) * 100) + "%" : "0%",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      description: `${stats.completed} out of ${stats.total} tasks completed`,
    },
    {
      title: "Due Soon",
      value: tasks.filter(task => {
        if (!task.dueDate || task.completed) return false;
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 2;
      }).length,
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      description: "Tasks due in the next 2 days",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
      description: "Tasks past their due date",
    },
  ];

  const categoryIcons = {
    work: <Briefcase className="w-4 h-4 text-category-work" />,
    personal: <User className="w-4 h-4 text-category-personal" />,
    health: <Heart className="w-4 h-4 text-category-health" />,
    shopping: <ShoppingBag className="w-4 h-4 text-category-shopping" />,
    other: <BarChart3 className="w-4 h-4 text-accent-foreground" />,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 font-handwritten">Task Analytics</h2>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {statsCards.map((card) => (
          <Card key={card.title} className="bg-glass border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2 bg-glass border border-white/20">
            <CardHeader>
              <CardTitle className="font-handwritten">Weekly Activity</CardTitle>
              <CardDescription>Tasks completed vs. added over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="added"
                      name="Tasks Added"
                      fill="rgba(59, 130, 246, 0.6)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="completed"
                      name="Tasks Completed"
                      fill="rgba(16, 185, 129, 0.6)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass border border-white/20">
            <CardHeader>
              <CardTitle className="font-handwritten">Categories</CardTitle>
              <CardDescription>Pending tasks by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.byCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center">
                    <div className="w-8">{categoryIcons[category as keyof typeof categoryIcons]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium capitalize">{category}</div>
                      <div className="w-full h-2 mt-1 overflow-hidden bg-muted rounded-full">
                        <div
                          className={`h-full bg-category-${category}`}
                          style={{
                            width: `${
                              stats.pending
                                ? Math.round((count / stats.pending) * 100)
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-8 ml-2 text-right text-sm">{count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p-6 bg-glass rounded-lg border border-white/20 mb-6">
          <h3 className="text-lg font-medium mb-3 font-handwritten">AI Insights</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Based on your task patterns, here are some observations:
          </p>
          <div className="space-y-3">
            <div className="p-3 bg-primary/5 rounded-md flex items-start">
              <div className="bg-primary/10 p-2 rounded-md mr-3">
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Completion Patterns</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  You tend to complete most tasks on weekdays, with your most productive
                  days being Tuesday and Thursday.
                </p>
              </div>
            </div>
            
            <div className="p-3 bg-primary/5 rounded-md flex items-start">
              <div className="bg-primary/10 p-2 rounded-md mr-3">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Category Analysis</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Work tasks make up the majority of your to-dos. Consider balancing with more
                  personal and health tasks for better work-life balance.
                </p>
              </div>
            </div>
            
            <div className="p-3 bg-primary/5 rounded-md flex items-start">
              <div className="bg-primary/10 p-2 rounded-md mr-3">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Time Management</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  You have {stats.overdue} overdue tasks. Try setting more realistic due dates
                  or breaking down large tasks into smaller ones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAnalytics;
