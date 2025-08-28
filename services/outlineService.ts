import { ai } from './geminiClient';
// FIX: Correct import path for types
import { FilePart, Source } from '../types/index';

/**
 * Generates a presentation title and outline based on user-provided text and files,
 * using Google Search for research.
 * @param text The user's input text or prompt.
 * @param files An array of file parts for additional context.
 * @returns An object containing the generated outline, a list of web sources, and a title.
 */
export const generateOutline = async (text: string, files: FilePart[]): Promise<{ outline: string; sources: Source[], title: string }> => {
  const prompt = `You are a research assistant. Your task is to analyze the provided context and generate a presentation plan.
  
  First, create a concise and engaging title for the presentation. The title MUST be on the very first line of your response, prefixed with "Title: ".

  Second, after the title, create a detailed, well-structured outline. For each slide, analyze its content and choose the MOST EFFECTIVE layout to represent the information. For example, if the content describes a sequence of events, use the TIMELINE layout. If it compares two concepts, use the COMPARISON layout. If it's a simple list, ONE_COLUMN_TEXT or DEFAULT might be best. You MUST prepend each slide title with a layout tag.

  Prepend each slide title with a layout tag from the following list:
  - [LAYOUT: DEFAULT] (Text on left, image on right)
  - [LAYOUT: DEFAULT_REVERSE] (Image on left, text on right)
  - [LAYOUT: ONE_COLUMN_TEXT] (For a title with only bullet points below it, no image)
  - [LAYOUT: TWO_COLUMN_TEXT] (Organize text into two distinct columns under a main title.)
  - [LAYOUT: TIMELINE] (Present a sequence of events chronologically.)
  - [LAYOUT: TITLE_ONLY] (A full-slide title for section breaks or intros.)
  - [LAYOUT: SECTION_HEADER] (A title with a supporting subtitle. Great for introductions.)
  - [LAYOUT: MAIN_POINT_EMPHASIS] (For highlighting one key fact or statement)
  - [LAYOUT: QUOTE] (For a quote and attribution)
  - [LAYOUT: COMPARISON] (Place two blocks of content side-by-side for comparison.)

  Example of intelligent layout choice:
  [LAYOUT: TIMELINE] Project Milestones
  - Q1: Initial Research & Discovery
  - Q2: Prototyping & User Testing

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