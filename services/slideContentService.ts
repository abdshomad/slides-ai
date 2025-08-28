import { ai } from './geminiClient';

/**
 * Generates speaker notes for a given slide's content.
 * @param slideContent An object with the slide's title and bullet points.
 * @returns The generated speaker notes as a string.
 */
export const generateSpeakerNotes = async (slideContent: { title: string; bulletPoints: string[] }): Promise<string> => {
  const prompt = `You are an expert presentation coach.
Your task is to generate speaker notes for a presentation slide.
The slide title is: "${slideContent.title}"
The bullet points are:
- ${slideContent.bulletPoints.join('\n- ')}

The speaker notes should:
1.  Provide additional context or examples to expand on the bullet points.
2.  Suggest talking points or questions to engage the audience.
3.  Be written in a clear, concise, and conversational tone.
4.  Do not just repeat the bullet points. Add value for the speaker.

Generate the speaker notes now.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
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
