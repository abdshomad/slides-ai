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