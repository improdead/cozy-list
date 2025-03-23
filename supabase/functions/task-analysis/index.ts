
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, message, context, task } = await req.json();

    let prompt;
    if (type === "chat") {
      prompt = `User Query: ${message}\n\nContext: ${JSON.stringify(context)}\n\nProvide a helpful response about the tasks, including suggestions and insights if relevant.`;
    } else if (type === "enhance-task") {
      prompt = `Enhance this task with more details and suggestions:
        Title: ${task.title}
        Category: ${task.category}
        Priority: ${task.priority}
        Due Date: ${task.dueDate}
        
        Please provide:
        1. A more detailed task description
        2. Suggested subtasks if applicable
        3. Any relevant tips or recommendations`;
    } else {
      throw new Error("Invalid request type");
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: type === "chat" ? 0.7 : 0.2,
          topP: 0.8,
          topK: 40
        }
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Failed to process with Gemini");
    }

    return new Response(
      JSON.stringify({
        response: type === "chat" ? result.candidates[0].content.parts[0].text : result.candidates[0].content.parts[0].text,
        suggestions: type === "enhance-task" ? result.candidates[0].content.parts[0].text : null
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "Error processing request",
        suggestions: null 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  }
});

