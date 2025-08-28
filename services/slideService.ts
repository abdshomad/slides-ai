import { ai } from './geminiClient';
// FIX: Correct import path for types
import { FilePart, Slide } from '../types/index';

/**
 * Generates slide content as a stream based on context, an outline, and a specified tone.
 * @param text The initial user prompt.
 * @param files An array of file parts for context.
 * @param outline The approved presentation outline.
 * @param tone The desired tone of voice for the content.
 * @returns An async generator that yields slide objects.
 */
export async function* generateSlidesStream(text: string, files: FilePart[], outline: string, tone: string): AsyncGenerator<Omit<Slide, 'id'>> {
    const prompt = `Based on the following approved presentation OUTLINE, generate the content for each slide. The initial text and files are provided for extra context. Each slide must have a concise title and several bullet points.

    For each slide, you have two options for the visual element:
    1.  **Find Images Online:** Use Google Search to find a list of up to 3 relevant, high-quality, royalty-free images. If you find suitable images, include them as a list of objects in an "imageSearchResults" field. Each object should have a "url" and a "title".
    2.  **Create an Image Prompt:** If you cannot find any suitable images online, do NOT provide "imageSearchResults". Instead, create a descriptive prompt for an AI image generator in an "imagePrompt" field. This prompt should describe a visually compelling, professional image.

    Provide EITHER "imageSearchResults" OR "imagePrompt" for each slide, never both. If a slide doesn't need a visual, omit both fields.

    Initial Context/Instructions:
    ---
    ${text || 'No additional text provided.'}
    ---

    Approved Outline:
    ---
    ${outline}
    ---
    
    IMPORTANT: Write all slide content (titles and bullet points) in a '${tone}' tone of voice.

    Your response MUST be a stream of JSON objects. Each JSON object represents a single slide. Do not wrap the output in a parent 'slides' array or use markdown. Just stream each slide object, one after the other.`;

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
            // Add incoming chunk to buffer
            buffer += chunk.text;
            
            // Clean markdown fences that might be at the start/end of the whole stream
            buffer = buffer.replace(/```json/g, '').replace(/```/g, '');

            let objectStartIndex = buffer.indexOf('{');
            while(objectStartIndex !== -1) {
                let braceCount = 0;
                let objectEndIndex = -1;

                // Find the matching closing brace for the first opening brace
                for (let i = objectStartIndex; i < buffer.length; i++) {
                    if (buffer[i] === '{') {
                        braceCount++;
                    } else if (buffer[i] === '}') {
                        braceCount--;
                    }
                    if (braceCount === 0) {
                        objectEndIndex = i;
                        break;
                    }
                }

                // If we found a complete object
                if (objectEndIndex !== -1) {
                    const jsonString = buffer.substring(objectStartIndex, objectEndIndex + 1);
                    try {
                        const slide = JSON.parse(jsonString);
                        yield slide;
                        
                        // Remove the parsed object from the buffer and continue
                        buffer = buffer.substring(objectEndIndex + 1);
                        objectStartIndex = buffer.indexOf('{');

                    } catch (e) {
                        // Failed to parse. This could be because it's not a real object.
                        // We'll advance past the first '{' to avoid an infinite loop on malformed data.
                        console.warn("Could not parse potential JSON object from stream:", jsonString, e);
                        buffer = buffer.substring(objectStartIndex + 1);
                        objectStartIndex = buffer.indexOf('{');
                    }
                } else {
                    // We have an opening brace but no closing one yet, so break and wait for more data
                    break;
                }
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