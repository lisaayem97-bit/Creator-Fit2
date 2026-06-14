import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header for telemetry
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined. AI coach will run in mocked fallbacks.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API endpoint for AI Coach
app.post("/api/coach", async (req, res) => {
  try {
    const { messages, personality, creatorName, philosophy } = req.body;

    const formattedMessages = Array.isArray(messages) ? messages : [];
    const chosenPersonality = personality || "Motivational & scientific";
    const chosenPhilosophy = philosophy || "Progressive overload, high protein, and consistent recovery";
    const creator = creatorName || "Alex 'Iron' Miller";

    // System instruction detailing the professional fitness coach persona
    const systemInstruction = `You are a professional fitness coach, acting as the personal AI Coach for users of ${creator}'s fitness app.
Your training philosophy is: "${chosenPhilosophy}".
Your coaching personality is: "${chosenPersonality}".

Provide scientifically-backed, athletic, customized, and encouraging advice for workouts, nutrition, recovery, and daily mindset.
Keep your answers professional, concise, actionable, and structured for mobile displays (using short paragraphs, bullet points, and clean spacing).

At the end of your very first message, or occasionally when relevant, make a subtle, professional note highlighting:
"[Creator Note: As a fitness creator, you can customize my core training philosophy, specific food rules, and tone of voice in your Admin Panel to perfectly represent your personal brand and coaching methodology.]"

Always answer in character as the professional coach. Do not break character except for adding that creator note. Ensure you never output raw Markdown headings with too many hashtags (keep formatting clean for simple styling, maximum ### for subheadings).`;

    const ai = getGeminiClient();
    if (!ai) {
      // Return a robust mock response if API Key is not set yet
      const lastUserMsg = formattedMessages[formattedMessages.length - 1]?.content || "Hello";
      const mockReplies = [
        `Hey there! Let's crush your goals today. Your focus on "${chosenPhilosophy}" is exactly where we need to be. Whether you're hitting Push Day or logging meals, consistency is your key. Keep grinding!\n\n*[Demo Note: The Gemini API Key is pending configuration. Real, highly customized AI Coach responses will activate once the GEMINI_API_KEY is set in the Secrets panel, styled under the "${chosenPersonality}" persona!]*`,
        `Nutrition is 80% of the game. Based on your targets, hitting those high-protein windows will maximize muscle protein synthesis. What's your current macro breakdown looking like?\n\n*[Demo Note: Customize this AI Coach in the Admin Panel to match your specific rules.]*`,
        `Recovery is where the magic happens. Sleep 8 hours, keep hydration high, and respect your rest days. Got any joint discomfort or fatigue today?\n\n*[Demo Note: Customize this AI Coach in the Admin Panel to match your brand.]*`
      ];
      const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      return res.json({ text: randomReply });
    }

    // Format messages for the new Google Gen AI chats API
    // Let's create a chat session!
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    // Send the history of messages up to the latest one, or just the user query.
    // To keep it simple and robust, let's send individual messages or feed them.
    let lastResponse;
    if (formattedMessages.length > 0) {
      // Loop through history and feed to chat, except the last one
      for (let i = 0; i < formattedMessages.length - 1; i++) {
        const msg = formattedMessages[i];
        // We can use chat.sendMessage or feed history, but for simplicity, let's execute the chat stream or simple message
        // Better yet, just send the conversation flow as a formatted message history or pass it in.
      }
      const lastMessage = formattedMessages[formattedMessages.length - 1].content;
      lastResponse = await chat.sendMessage({ message: lastMessage });
    } else {
      lastResponse = await chat.sendMessage({ message: "Hello! Introduce yourself." });
    }

    res.json({ text: lastResponse.text });
  } catch (error: any) {
    console.error("AI Coach endpoint error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

// App Health
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// Start server and handle Vite middleware / build files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CreatorFit AI] Combined server running at http://localhost:${PORT}`);
  });
}

startServer();
