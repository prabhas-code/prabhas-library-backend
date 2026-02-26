import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateBookDescription = async (req, res) => {
  const { title, genre } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Book title required" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Write a professional and engaging book description.
Title: ${title}
Genre: ${genre || "General"}
Limit to 100 words.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      description: text,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ message: "AI generation failed" });
  }
};
