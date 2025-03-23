
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/tasks");
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      setLoading(true);
      
      if (isSignUp) {
        // Sign up
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
        });
        
        if (error) throw error;
        
        toast.success("Signup successful! Please check your email for verification.");
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        navigate("/tasks");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 bg-paper-texture flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <Check className="w-10 h-10 text-amber-800 mr-2" />
            <h1 className="text-4xl font-bold font-handwritten text-amber-800">Cozy List</h1>
          </div>
          <p className="text-amber-700 mt-2 font-handwritten">Your personal task manager</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 font-handwritten text-center text-amber-800">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h2>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-700 mb-1 font-handwritten">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full font-handwritten"
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-700 mb-1 font-handwritten">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full font-handwritten"
                disabled={loading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full font-handwritten"
              disabled={loading}
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-amber-600 hover:underline font-handwritten"
              disabled={loading}
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
