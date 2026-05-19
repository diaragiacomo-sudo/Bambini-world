import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API Route - Generate a magic story
  app.post("/api/generate-story", async (req, res) => {
    try {
      const { topic } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Scrivi una fiaba brevissima (max 150 parole) per bambini su questo tema: ${topic || "un'avventura magica"}. La storia deve essere allegra e avere una piccola morale.`,
        config: {
          systemInstruction: "Sei un narratore di fiabe magiche per bambini. Scrivi in italiano, usa emoji e un tono gioioso.",
          temperature: 0.8,
        },
      });
      
      res.json({ story: response.text });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Oh no! La magia si è inceppata. Riprova più tardi!" });
    }
  });

  // API Route - Get a random magic word
  app.get("/api/magic-word", (req, res) => {
    const words = ["Avventura", "Sogno", "Amicizia", "Coraggio", "Curiosità", "Incanto"];
    const word = words[Math.floor(Math.random() * words.length)];
    res.json({ word });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
