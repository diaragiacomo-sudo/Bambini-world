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

  // Gemini API Route - Generate a magic story with image and audio
  app.post("/api/generate-story", async (req, res) => {
    try {
      const { topic } = req.body;
      
      // 1. Generate Story (Longer)
      const storyResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: `Scrivi una fiaba incantevole (circa 250-300 parole) per bambini su questo tema: ${topic || "un'avventura magica"}. La storia deve essere divisa in paragrafi, essere allegra, piena di magia e avere una bella morale finale.` }] }],
        config: {
          systemInstruction: "Sei un narratore di fiabe magiche per bambini. Scrivi in italiano, usa emoji e un tono gioioso e rassicurante.",
          temperature: 0.8,
        },
      });
      
      const story = storyResponse.text;
      if (!story) throw new Error("No story generated");

      // 2. Generate Image Prompt based on the story
      const promptResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: `Basandoti su questa fiaba, scrivi un prompt in inglese (massimo 50 parole) per generare un'illustrazione in stile "libro per bambini dai colori vivaci e magici": ${story}` }] }],
        config: {
          systemInstruction: "Extract the most visual scene from the story and describe it as a prompt for image generation.",
        }
      });
      const imagePrompt = promptResponse.text || `Illustration for a children's story about ${topic}`;

      // 3. Generate Image
      let imageData = null;
      try {
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image-preview',
          contents: { parts: [{ text: imagePrompt }] },
          config: {
            imageConfig: { aspectRatio: "16:9", imageSize: "1K" }
          },
        });
        
        for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            imageData = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      } catch (imgErr) {
        console.error("Image Gen Error:", imgErr);
        // Fallback or just null
      }

      // 4. Generate Audio (TTS)
      let audioData = null;
      try {
        const audioResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: `Racconta con voce gioiosa questa storia: ${story}` }] }],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is a good cheerful choice
              },
            },
          },
        });
        
        const base64Audio = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          audioData = `data:audio/wav;base64,${base64Audio}`;
        }
      } catch (audioErr) {
        console.error("Audio Gen Error:", audioErr);
        // Fallback or just null
      }

      res.json({ story, image: imageData, audio: audioData });
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
