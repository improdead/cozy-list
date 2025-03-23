import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Rocket, CheckCircle, Lightbulb, ShieldCheck, Calendar as CalendarIcon } from "lucide-react";

const Home = () => {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // We don't want to redirect users from the home page
  // This allows users to see the home page without being logged in

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 bg-paper-texture">
      {/* Hero Section - Increased top padding and adjusted layout */}
      <section className="pt-36 pb-24"> {/* Changed py-24 to pt-36 pb-24 */}
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12"> {/* Increased gap from 8 to 12 */}
            {/* Left Column - Text Content - Made larger */}
            <div className="md:w-1/2 text-center md:text-left space-y-8"> {/* Added space-y-8 */}
              <h1 className="text-6xl md:text-7xl font-bold font-handwritten text-amber-800 leading-tight"> {/* Increased text size and added leading-tight */}
                Take Control of Your Life with Cozy-List
              </h1>
              <p className="text-2xl text-amber-700 font-handwritten"> {/* Increased from text-xl to text-2xl */}
                Organize your tasks, boost your productivity, and achieve your goals with our intuitive task
                management app.
              </p>
              <Button
                size="lg"
                className="hero-button bg-amber-600 hover:bg-amber-700 text-white font-handwritten rounded-full text-lg px-8 py-6" /* Made button larger */
                onClick={() => navigate("/tasks")}
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    Get Started <Rocket className="ml-2 h-6 w-6" /> {/* Made icon larger */}
                  </>
                )}
              </Button>
            </div>
            
            {/* Right Column - Image - Adjusted positioning */}
            <div className="md:w-1/2 mt-8 md:mt-0 flex flex-col items-center">
              <div className="relative max-w-md transform hover:scale-105 transition-transform duration-300 -mt-8"> {/* Added negative margin top */}
                <img 
                  src="/lovable-uploads/postspark_export_2025-03-22_22-18-09.png" 
                  alt="Smart Suggestions Panel" 
                  className="w-full h-auto drop-shadow-xl rounded-xl"
                />
                <div className="absolute -bottom-6 left-0 right-0 text-center">
                  <p className="inline-block bg-amber-50 px-4 py-2 rounded-full font-handwritten text-amber-700 text-sm border border-amber-200 shadow-sm">
                    <Sparkles className="inline h-4 w-4 text-amber-500 mr-1" />
                    Get personalized task suggestions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold font-handwritten text-amber-800 mb-8 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="homepage-card">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-amber-600 w-6 h-6" />
                <h3 className="text-xl font-semibold font-handwritten text-amber-800">
                  Intuitive Task Management
                </h3>
              </div>
              <p className="text-amber-700 font-handwritten">
                Easily create, organize, and prioritize your tasks with our user-friendly interface.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="homepage-card">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="text-amber-600 w-6 h-6" />
                <h3 className="text-xl font-semibold font-handwritten text-amber-800">
                  Smart Suggestions
                </h3>
              </div>
              <p className="text-amber-700 font-handwritten">
                Receive intelligent suggestions to optimize your workflow and stay productive.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="homepage-card">
              <div className="flex items-center gap-3 mb-4">
                <CalendarIcon className="text-amber-600 w-6 h-6" />
                <h3 className="text-xl font-semibold font-handwritten text-amber-800">
                  Calendar Integration
                </h3>
              </div>
              <p className="text-amber-700 font-handwritten">
                Seamlessly integrate your tasks with your calendar for better time management.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="homepage-card">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-amber-600 w-6 h-6" />
                <h3 className="text-xl font-semibold font-handwritten text-amber-800">
                  Secure and Private
                </h3>
              </div>
              <p className="text-amber-700 font-handwritten">
                Your data is protected with top-notch security measures, ensuring your privacy.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="homepage-card">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-amber-600 w-6 h-6" />
                <h3 className="text-xl font-semibold font-handwritten text-amber-800">
                  Customizable Experience
                </h3>
              </div>
              <p className="text-amber-700 font-handwritten">
                Tailor the app to your preferences with customizable themes and settings.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="homepage-card">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="text-amber-600 w-6 h-6" />
                <h3 className="text-xl font-semibold font-handwritten text-amber-800">
                  Cross-Platform Access
                </h3>
              </div>
              <p className="text-amber-700 font-handwritten">
                Access your tasks from any device, anywhere, with our responsive web app.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white py-8 border-t border-amber-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-handwritten text-amber-800">Cozy-List</h3>
              <p className="text-amber-600 mt-1 text-sm">Organize your tasks beautifully</p>
            </div>
            
            <div className="flex gap-6">
              <a 
                href="/terms" 
                className="text-amber-600 hover:text-amber-800 transition-colors font-handwritten"
              >
                Terms
              </a>
              <a 
                href="/privacy" 
                className="text-amber-600 hover:text-amber-800 transition-colors font-handwritten"
              >
                Privacy
              </a>
              <a 
                href="mailto:lidekai2008@gmail.com" 
                className="text-amber-600 hover:text-amber-800 transition-colors font-handwritten"
              >
                Contact
              </a>
            </div>
            
            <div>
              <p className="text-amber-500 text-sm">© {new Date().getFullYear()} Cozy-List. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

