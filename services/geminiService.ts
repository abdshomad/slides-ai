import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Presentation, FilePart, Slide, Source } from '../types';
import { presentationSchema } from './schemas';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateOutline = async (text: string, files: FilePart[]): Promise<{ outline: string; sources: Source[], title: string }> => {
  const prompt = `You are a research assistant. Your task is to analyze the provided context and generate a presentation plan.
  
  First, create a concise and engaging title for the presentation. The title MUST be on the very first line of your response, prefixed with "Title: ".

  Second, after the title, create a detailed, well-structured outline for the presentation.

  Use the provided text and files as the primary context. Use Google Search to find up-to-date and relevant information. The outline should be logical and comprehensive.

  Topic/Instructions:
  ---
  ${text || 'No additional text provided.'}
  ---
`;

  const requestParts: ({ text: string } | FilePart)[] = [{ text: prompt }, ...files];

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: requestParts },
        config: {
            tools: [{googleSearch: {}}],
        },
    });

    const fullResponseText = response.text;
    let title = "Untitled Presentation";
    let outlineText = fullResponseText;

    if (!fullResponseText) {
        throw new Error("The AI failed to generate an outline. Please try again.");
    }
    
    const titleMatch = fullResponseText.match(/^Title: (.*)/);
    if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
        outlineText = fullResponseText.substring(titleMatch[0].length).trim();
    } else {
        // Fallback if the model doesn't follow instructions precisely
        const lines = fullResponseText.split('\n');
        title = lines[0].replace(/^Title: /i, '').trim();
        outlineText = lines.slice(1).join('\n').trim();
    }
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // FIX: Removed invalid generic type argument `<Source[]>` from `reduce` and typed the accumulator `acc` instead.
    const sources: Source[] = (groundingChunks || []).reduce((acc: Source[], chunk) => {
        if (chunk.web?.uri) {
          acc.push({
            web: {
              uri: chunk.web.uri,
              title: chunk.web.title || chunk.web.uri,
            },
          });
        }
        return acc;
      }, []);

    return { outline: outlineText, sources, title };
  } catch (error) {
    console.error("Error generating outline:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
       throw new Error("The provided API Key is not valid. Please check your configuration.");
    }
    throw new Error("Failed to generate an outline. The research step encountered an issue.");
  }
};


export async function* generateSlidesStream(text: string, files: FilePart[], outline: string, tone: string): AsyncGenerator<Omit<Slide, 'id'>> {
    const prompt = `Based on the following approved presentation OUTLINE, generate the content for each slide. The initial text and files are provided for extra context. Each slide must have a concise title and several bullet points.

    For each slide, you have two options for the visual element:
    1.  **Find an Image Online:** Use Google Search to find a relevant, high-quality, royalty-free image. If you find a suitable image, include its direct URL in an "imageUrl" field.
    2.  **Create an Image Prompt:** If you cannot find a suitable image online, do NOT provide an "imageUrl". Instead, create a descriptive prompt for an AI image generator in an "imagePrompt" field. This prompt should describe a visually compelling, professional image.

    Provide EITHER "imageUrl" OR "imagePrompt" for each slide, never both. If a slide doesn't need a visual, omit both fields.

    Initial Context/Instructions:
    ---
    ${text || 'No additional text provided.'}
    ---

    Approved Outline:
    ---
    ${outline}
    ---
    
    IMPORTANT: Write all slide content (titles and bullet points) in a '${tone}' tone of voice.

    Your response MUST be a stream of line-delimited JSON objects. Each JSON object represents a single slide. Do not wrap the output in a parent 'slides' array or use markdown. Just stream each slide object, one after the other, separated by a newline.`;

    const requestParts: ({ text: string } | FilePart)[] = [{ text: prompt }, ...files];

    try {
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: { parts: requestParts },
            config: {
                tools: [{googleSearch: {}}],
                temperature: 0.7,
            },
        });

        let buffer = '';
        for await (const chunk of responseStream) {
            buffer += chunk.text;
            let newlineIndex;
            while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
                const line = buffer.substring(0, newlineIndex).trim();
                buffer = buffer.substring(newlineIndex + 1);
                if (line) {
                    try {
                        const slide = JSON.parse(line);
                        yield slide;
                    } catch (e) {
                        console.warn("Could not parse slide JSON from stream:", line, e);
                    }
                }
            }
        }
        // Process any remaining text in the buffer after the stream ends
        if (buffer.trim()) {
            try {
                const slide = JSON.parse(buffer.trim());
                yield slide;
            } catch (e) {
                console.warn("Could not parse final slide JSON from stream:", buffer.trim(), e);
            }
        }

    } catch (error) {
        console.error("Error generating slides:", error);
        if (error instanceof Error && error.message.includes("API key not valid")) {
            throw new Error("The provided API Key is not valid. Please check your configuration.");
        }
        throw new Error("Failed to generate slides. Please check your input or try again later.");
    }
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const generateImageForSlide = async (prompt: string): Promise<string> => {
  if (!prompt) return "";
  
  let retries = 3;
  let waitTime = 2000; // Start with a 2-second wait

  while (retries > 0) {
    try {
      const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
          },
      });
      
      if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
      }
      return ""; // Success but no image, so we don't retry.
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Check for rate limit / resource exhausted errors
      if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        retries--;
        if (retries > 0) {
          console.warn(`Rate limit hit for prompt "${prompt}". Retrying in ${waitTime / 1000}s... (${retries} attempts left)`);
          await delay(waitTime);
          waitTime *= 2; // Exponential backoff
        } else {
          console.error(`Final attempt failed for prompt "${prompt}" due to rate limiting:`, error);
          return ""; // Return empty string to not block other images.
        }
      } else {
        // For other types of errors, fail immediately for this image
        console.error(`Error generating image for prompt "${prompt}":`, error);
        return "";
      }
    }
  }
  return ""; // Should only be reached if all retries fail.
};


export const editSlide = async (slide: Slide, userPrompt: string): Promise<Partial<Slide>> => {
    const prompt = `You are an AI presentation slide editor. Your task is to modify a slide based on the user's instructions.
You will receive the slide's current text content and optionally an image. The user's instructions are also provided.

Your text response MUST be a single, valid JSON object and nothing else. Do not add markdown formatting like \`\`\`json
`;

    // This is a placeholder for a more complex implementation that would handle multimodal input
    // For now, we'll just demonstrate text and image prompt updates.

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `User Instructions: "${userPrompt}". Current Slide Title: "${slide.title}". Current Bullets: ${JSON.stringify(slide.bulletPoints)}. Respond with a JSON object containing the updated 'title', 'bulletPoints', and a new 'imagePrompt'. If a value doesn't need to change, return the original value.`,
         config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    imagePrompt: { type: Type.STRING },
                }
            }
        }
    });

    const result = JSON.parse(response.text);

    let finalResult: Partial<Slide> = {
        title: result.title,
        bulletPoints: result.bulletPoints,
        imagePrompt: result.imagePrompt,
    };

    // If the image prompt has changed, generate a new image
    if (result.imagePrompt && result.imagePrompt !== slide.imagePrompt) {
        finalResult.image = await generateImageForSlide(result.imagePrompt);
    }

    return finalResult;
};


// These functions are placeholders and would need a proper implementation
export const generateSpeakerNotes = async (slideContent: { title: string; bulletPoints: string[] }): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate concise speaker notes for a presentation slide with the title "${slideContent.title}" and these bullet points: ${slideContent.bulletPoints.join(', ')}. The notes should provide extra context or talking points.`,
  });
  return response.text;
};

export const generateKeyTakeaway = async (slideContent: { title: string; bulletPoints: string[] }): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `What is the single most important key takeaway from a slide with the title "${slideContent.title}" and these bullet points: ${slideContent.bulletPoints.join(', ')}? State it in one short sentence.`,
  });
  return response.text;
};

export const expandSlide = async (slideContent: { title: string; bulletPoints: string[] }): Promise<Omit<Slide, 'id'>[]> => {
    // This is a simplified example. A real implementation would be more robust.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Take the core idea from this slide (Title: "${slideContent.title}", Content: "${slideContent.bulletPoints.join(', ')}") and expand it into 2-3 new, detailed slides that logically follow it. For each new slide, provide a title, bulletPoints, and an imagePrompt. Respond as an array of JSON objects.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: presentationSchema.properties.slides,
        }
    });
    return JSON.parse(response.text);
};