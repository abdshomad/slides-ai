import { ai } from './geminiClient';

/**
 * Generates speaker notes for a given slide's content.
 * @param slideContent An object with the slide's title and bullet points.
 * @returns The generated speaker notes as a string.
 */
export const generateSpeakerNotes = async (slideContent: { title: string; bulletPoints: string[] }): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate concise speaker notes for a presentation slide with the title "${slideContent.title}" and these bullet points: ${slideContent.bulletPoints.join(', ')}. The notes should provide extra context or talking points.`,
  });
  return response.text;
};

/**
 * Generates a single key takeaway sentence for a slide.
 * @param slideContent An object with the slide's title and bullet points.
 * @returns The generated key takeaway as a string.
 */
export const generateKeyTakeaway = async (slideContent: { title: string; bulletPoints: string[] }): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `What is the single most important key takeaway from a slide with the title "${slideContent.title}" and these bullet points: ${slideContent.bulletPoints.join(', ')}? State it in one short sentence.`,
  });
  return response.text;
};
