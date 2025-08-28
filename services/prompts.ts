// FIX: Correct import path for types
import { Slide } from '../types/index';

export const getEditSlidePrompt = (slide: Slide, userPrompt: string): string => {
    return `You are an AI presentation slide editor. Your task is to modify a slide based on the user's instructions.
You will receive the slide's current text content and layout.

Analyze the user's instructions and the slide's content to determine the changes needed.

For the text content, you can modify the 'title' and 'bulletPoints'. You can also add content for specific layouts by providing 'subtitle' (for headers), 'quote' and 'attribution' (for quote slides), 'mainPoint' (for emphasis slides), or 'subtitle1'/'body1'/'subtitle2'/'body2' for two-column/comparison layouts. Only provide these special fields if the user's instructions clearly ask for them or if they fit the current slide layout. For two-column layouts, use 'body1' and 'body2' instead of 'bulletPoints'.

For the visual element, first, prioritize finding a list of up to 3 suitable, high-quality, royalty-free images using Google Search. If you find them, provide them as a list of objects in the 'imageSearchResults' field. Each object must have a 'url' and a 'title'.

If suitable images cannot be found via search, create a new, descriptive 'imagePrompt' for an AI image generator.

If the user explicitly asks for a video, animation, or moving picture, create a 'videoPrompt' instead of an 'imagePrompt'.

Provide EITHER 'imageSearchResults' OR 'imagePrompt' OR 'videoPrompt', but not more than one. If the user's prompt doesn't imply a visual change (e.g., 'fix a typo'), omit all visual fields. If the visual should be removed, return null for all visual fields.

User Instructions: "${userPrompt}"
Current Slide Layout: "${slide.layout || 'DEFAULT'}"
Current Slide Title: "${slide.title}"
Current Bullets: ${JSON.stringify(slide.bulletPoints)}
Current Body 1: ${JSON.stringify(slide.body1)}
Current Body 2: ${JSON.stringify(slide.body2)}

Your text response MUST be a single, valid JSON object and nothing else. Do not add markdown formatting like \`\`\`json.
`;
};