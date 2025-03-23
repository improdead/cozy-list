
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Terms = () => {
  return (
    <div className="min-h-screen bg-amber-50 bg-paper-texture">
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2 text-amber-800 hover:text-amber-600 font-handwritten">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-amber-800 font-handwritten mb-6">Terms of Service</h1>
          
          <div className="space-y-6 text-amber-800 font-handwritten">
            <p>Last Updated: June 15, 2024</p>
            
            <h2 className="text-xl font-bold text-amber-800">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Cozy List, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
            
            <h2 className="text-xl font-bold text-amber-800">2. Description of Service</h2>
            <p>
              Cozy List provides task management features including AI-powered suggestions, calendar integration, and productivity analytics.
            </p>
            
            <h2 className="text-xl font-bold text-amber-800">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
            
            <h2 className="text-xl font-bold text-amber-800">4. User Data</h2>
            <p>
              We collect and process data in accordance with our Privacy Policy. By using Cozy List, you consent to such processing and you warrant that all data provided by you is accurate.
            </p>
            
            <h2 className="text-xl font-bold text-amber-800">5. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users of the Service, us, or third parties, or for any other reason at our sole discretion.
            </p>
            
            <h2 className="text-xl font-bold text-amber-800">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of any material changes through the Service or via email.
            </p>
            
            <h2 className="text-xl font-bold text-amber-800">7. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at: <a href="mailto:lidekai2008@gmail.com" className="text-amber-600 hover:text-amber-800 underline">lidekai2008@gmail.com</a>
            </p>
          </div>
        </div>
        
        <div className="text-center text-amber-700 font-handwritten pt-4 border-t border-amber-200">
          <p>© 2024 Cozy List. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/" className="text-amber-600 hover:text-amber-800">Home</Link>
            <Link to="/privacy" className="text-amber-600 hover:text-amber-800">Privacy Policy</Link>
            <a href="mailto:lidekai2008@gmail.com" className="text-amber-600 hover:text-amber-800">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
