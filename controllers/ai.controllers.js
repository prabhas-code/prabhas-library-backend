import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // 🔐 secure
});

export const generateBookDescription = async (req, res) => {
  const { title, genre } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Book title required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a professional and engaging book description.
Title: ${title}
Genre: ${genre || "General"}
Limit to 100 words.`,
    });

    return res.status(200).json({
      description: response.text,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ message: "AI generation failed" });
  }
};
