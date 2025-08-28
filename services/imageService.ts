import { ai } from './geminiClient';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Generates an image for a slide using the given prompt, with built-in retry logic for rate limiting.
 * @param prompt The text prompt to generate an image from.
 * @returns A base64 encoded string of the generated image, or an empty string if generation fails.
 */
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