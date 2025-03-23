
import React from "react";
import { Link } from "react-router-dom";
import { Check, Calendar, ListTodo, BarChart3, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="w-full py-6 mb-4 animate-fade-in">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center">
          <Check className="w-8 h-8 mr-2 text-amber-800" />
          <Link to="/" className="text-3xl font-bold font-handwritten text-amber-800">Cozy List</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/" className="text-amber-800 hover:text-amber-600 transition-colors">
            <Button variant="ghost" size="sm" className="gap-1 rounded-full text-amber-800 hover:text-amber-600 hover:bg-amber-100">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline font-handwritten">Home</span>
            </Button>
          </Link>
          
          <nav className="flex p-1 space-x-1 bg-glass rounded-full">
            <Button
              variant={activeTab === "tasks" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("tasks")}
              className={`gap-1 rounded-full transition-all duration-300 font-handwritten ${
                activeTab === "tasks" 
                  ? "bg-amber-600 text-white" 
                  : "text-amber-800 hover:text-amber-600 hover:bg-amber-100"
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span className="hidden sm:inline">Tasks</span>
            </Button>
            
            <Button
              variant={activeTab === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("calendar")}
              className={`gap-1 rounded-full transition-all duration-300 font-handwritten ${
                activeTab === "calendar" 
                  ? "bg-amber-600 text-white" 
                  : "text-amber-800 hover:text-amber-600 hover:bg-amber-100"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </Button>
            
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("analytics")}
              className={`gap-1 rounded-full transition-all duration-300 font-handwritten ${
                activeTab === "analytics" 
                  ? "bg-amber-600 text-white" 
                  : "text-amber-800 hover:text-amber-600 hover:bg-amber-100"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
