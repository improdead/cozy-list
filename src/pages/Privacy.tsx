
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Privacy = () => {
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
          <h1 className="text-3xl font-bold text-amber-800 font-handwritten mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-amber-800 font-handwritten">
            <p>Last Updated: June 15, 2024</p>
            
            <h2 className="text-xl font-bold text-amber-800">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as account information, task data, 
              usage information, and device information to provide and improve our services.
            </p>
            
            <h2 className="text-xl font-bold text-amber-800">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, to process 
              transactions, send you related information, communicate with you, and monitor and analyze trends.
            </p>
            
            <h2 className="text-xl font-bold text-amber-800">3. Information Sharing</h2>
            <p>
              We do not share your personal information with third parties except as described in this Privacy Policy, 
              including with vendors and service providers, in connection with business transfers, and for legal reasons.
            </p>
            
            <h2 className="text-xl font-bold text-amber-800">4. Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, 
              unauthorized access, disclosure, alteration, and destruction.
            </p>
            
            <h2 className="text-xl font-bold text-amber-800">5. Your Choices</h2>
            <p>
              You can access and update certain information through your account settings. You may also opt out 
              of receiving promotional communications from us by following the instructions in those communications.
            </p>
            
            <h2 className="text-xl font-bold text-amber-800">6. Changes to Privacy Policy</h2>
            <p>
              We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising 
              the date at the top of the policy and, in some cases, we may provide you with additional notice.
            </p>
            
            <h2 className="text-xl font-bold text-amber-800">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:lidekai2008@gmail.com" className="text-amber-600 hover:text-amber-800 underline">lidekai2008@gmail.com</a>
            </p>
          </div>
        </div>
        
        <div className="text-center text-amber-700 font-handwritten pt-4 border-t border-amber-200">
          <p>© 2024 Cozy List. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/" className="text-amber-600 hover:text-amber-800">Home</Link>
            <Link to="/terms" className="text-amber-600 hover:text-amber-800">Terms of Service</Link>
            <a href="mailto:lidekai2008@gmail.com" className="text-amber-600 hover:text-amber-800">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
