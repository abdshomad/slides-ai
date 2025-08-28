import { Type } from "@google/genai";
import { ai } from './geminiClient';
// FIX: Correct import path for types
import { Slide, FactCheckResult } from '../types/index';
import { presentationSchema, factCheckSchema, chartSchema, adaptAudienceSchema } from './schemas';
import { getEditSlidePrompt } from './prompts';

/**
 * Edits a slide's text content and visual suggestions based on a user's instructions.
 * This function will prioritize finding an image with Google Search.
 * @param slide The current slide object.
 * @param userPrompt The user's instructions for editing.
 * @returns A partial slide object with the updated text and visual suggestions (`imageSearchResults` or `imagePrompt`).
 */
export const editSlide = async (slide: Slide, userPrompt: string): Promise<Partial<Slide>> => {
    const prompt = getEditSlidePrompt(slide, userPrompt);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
         config: {
            tools: [{googleSearch: {}}],
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    subtitle: { type: Type.STRING, description: "A subtitle, used for SECTION_HEADER layouts." },
                    quote: { type: Type.STRING, description: "The main text of a quote for QUOTE layouts." },
                    attribution: { type: Type.STRING, description: "The attribution for a quote." },
                    mainPoint: { type: Type.STRING, description: "A key phrase or number for MAIN_POINT_EMPHASIS layouts." },
                    subtitle1: { type: Type.STRING, description: "Subtitle for the first column in a COMPARISON layout." },
                    body1: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Bullet points for the first column in COMPARISON or TWO_COLUMN_TEXT layouts." },
                    subtitle2: { type: Type.STRING, description: "Subtitle for the second column in a COMPARISON layout." },
                    body2: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Bullet points for the second column in COMPARISON or TWO_COLUMN_TEXT layouts." },
                    imagePrompt: { type: Type.STRING, description: "A new prompt for an image generator. Provide this ONLY if a suitable image cannot be found from a web search." },
                    imageSearchResults: {
                        type: Type.ARRAY,
                        description: "A list of up to 3 relevant, royalty-free images. Provide this instead of an imagePrompt if suitable images are found.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                url: { type: Type.STRING },
                                title: { type: Type.STRING }
                            },
                        }
                    },
                    chartData: chartSchema
                },
                required: ["title"]
            }
        }
    });

    return JSON.parse(response.text);
};


/**
 * Expands a single slide into 2-3 new, more detailed slides.
 * @param slideContent The content of the slide to expand.
 * @returns An array of new slide objects (without IDs).
 */
export const expandSlide = async (slideContent: { title: string; bulletPoints: string[] }): Promise<Omit<Slide, 'id'>[]> => {
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

/**
 * Fact-checks a slide's content using Google Search and provides suggestions.
 * @param slide The current slide object.
 * @returns A FactCheckResult object with updated content and a summary of changes.
 */
export const factCheckSlide = async (slide: Slide): Promise<FactCheckResult> => {
  const prompt = `You are an AI fact-checker and editor. Your task is to verify the information on the provided presentation slide using Google Search and offer corrections or updates.
The user wants to ensure the content is accurate and up-to-date.

1.  Analyze the slide's title and each bullet point.
2.  Use Google Search to find the most current and reliable information on these topics.
3.  Based on your research, provide an updated version of the slide's title and bullet points. If a statement is correct, keep it. If it's incorrect or outdated, correct it. You can also add new, relevant points if they enhance the slide's accuracy.
4.  Provide a concise summary of the key changes you made and why.

Current Slide Title: "${slide.title}"
Current Bullet Points: ${JSON.stringify(slide.bulletPoints)}

Your response MUST be a single, valid JSON object with the updated content and a summary of your changes. Do not add markdown formatting.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: factCheckSchema,
    },
  });

  return JSON.parse(response.text);
};

/**
 * Uses a multimodal model to critique a slide's design based on an image and provides suggestions.
 * @param imageBase64 A base64 encoded PNG of the slide's visual appearance.
 * @returns A string containing the AI's critique and suggestions in markdown format.
 */
export const critiqueSlide = async (imageBase64: string): Promise<string> => {
    const prompt = `You are a world-class UI/UX and presentation design expert.
    Critique the provided slide image.
    Based on your critique, provide a list of concrete, actionable visual improvement ideas. Focus on layout, typography, color theory, and imagery. Be creative and inspiring. Structure your response in markdown, using headings and bullet points.`;

    const imagePart = {
        inlineData: {
            mimeType: 'image/png',
            data: imageBase64,
        },
    };

    const textPart = {
        text: prompt
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [imagePart, textPart] },
    });

    return response.text;
};

/**
 * Rewrites slide content for a specific target audience.
 * @param slide The current slide object.
 * @param targetAudience A description of the new audience.
 * @returns A partial slide object with the rewritten title and bullet points.
 */
export const adaptAudience = async (slide: Pick<Slide, 'title' | 'bulletPoints'>, targetAudience: string): Promise<Pick<Slide, 'title' | 'bulletPoints'>> => {
  const prompt = `You are an expert communicator and content strategist. Your task is to rewrite the content of a presentation slide to make it suitable for a new target audience.

Analyze the original slide content and the description of the target audience. Rewrite the title and bullet points to use appropriate language, tone, and complexity for that audience.

Original Slide Title: "${slide.title}"
Original Bullet Points: ${JSON.stringify(slide.bulletPoints)}

Target Audience: "${targetAudience}"

Your response MUST be a single, valid JSON object containing the rewritten "title" and "bulletPoints". Do not add markdown formatting.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: adaptAudienceSchema,
    },
  });

  return JSON.parse(response.text);
};