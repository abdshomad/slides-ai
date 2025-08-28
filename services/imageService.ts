import { ai } from './geminiClient';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Generates an image for a slide using the given prompt, with built-in retry logic for rate limiting.
 * @param prompt The text prompt to generate an image from.
 * @param negativePrompt An optional text prompt of things to exclude from the image.
 * @returns A base64 encoded string of the generated image, or an empty string if generation fails.
 */
export const generateImageForSlide = async (prompt: string, negativePrompt?: string): Promise<string> => {
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
            negativePrompt: negativePrompt,
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


/**
 * Generates multiple image suggestions for a slide using the given prompt.
 * @param prompt The text prompt to generate images from.
 * @returns An array of base64 encoded strings of the generated images.
 */
export const generateImageSuggestions = async (prompt: string): Promise<string[]> => {
  if (!prompt) return [];
  
  // Using a simpler retry logic for suggestions to fail faster if the service is busy.
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 3, // Request 3 suggestions
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages.map(img => img.image.imageBytes);
    }
    return [];
  } catch (error) {
    console.error(`Error generating image suggestions for prompt "${prompt}":`, error);
    // For suggestions, we fail gracefully to not block the user.
    return [];
  }
};