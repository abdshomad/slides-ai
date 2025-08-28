import { Modality } from "@google/genai";
import { ai } from './geminiClient';

/**
 * Edits an image using a multimodal model based on a text prompt.
 * @param base64ImageData The base64 encoded string of the image to edit.
 * @param prompt The user's instructions for what to change in the image.
 * @returns A base64 encoded string of the edited image, or null if editing fails.
 */
export const editImage = async (base64ImageData: string, prompt: string): Promise<string | null> => {
  if (!base64ImageData || !prompt) return null;

  try {
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: 'image/jpeg', // Assuming jpeg, could be parameterized if needed
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        // Must include both Modality.IMAGE and Modality.TEXT
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Find the first valid image part in the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data && part.inlineData.data.length > 1000) {
        return part.inlineData.data;
      }
    }

    console.warn("Image editing model did not return a valid image part.");
    return null;

  } catch (error) {
    console.error("Error editing image with multimodal model:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
       throw new Error("The provided API Key is not valid. Please check your configuration.");
    }
    throw new Error("Failed to edit the image. The AI model encountered an issue.");
  }
};