import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getAIResponse(
  prompt: string,
  files?: File[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    if (files?.length) {
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      if (imageFiles.length) {
        const imageModel = genAI.getGenerativeModel({
          model: "gemini-pro-vision",
        });
        const imageContents = await Promise.all(
          imageFiles.map(async (file) => {
            const data = await file.arrayBuffer();
            const base64Data = btoa(
              new Uint8Array(data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
            return {
              inlineData: {
                data: base64Data,
                mimeType: file.type,
              },
            };
          })
        );

        const result = await imageModel.generateContent([
          prompt,
          ...imageContents,
        ]);
        return result.response.text();
      }
    }

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI Response Error:", error);
    throw new Error("Failed to get AI response");
  }
}
