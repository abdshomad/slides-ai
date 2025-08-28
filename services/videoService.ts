import { ai } from './geminiClient';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const progressMessages = [
    "Initializing video generation...",
    "Your video is being processed. This can take a few minutes.",
    "AI is crafting the scene, frame by frame.",
    "Still working... creating high-quality motion.",
    "Almost there! Finalizing and encoding your video.",
];

export const generateVideoForSlide = async (
    prompt: string,
    onProgress: (message: string) => void
): Promise<string> => {
    if (!prompt) return "";
    
    onProgress(progressMessages[0]);
    
    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
            },
        });
        
        let progressIndex = 1;
        onProgress(progressMessages[progressIndex]);

        while (!operation.done) {
            await delay(10000); // Poll every 10 seconds
            operation = await ai.operations.getVideosOperation({ operation: operation });
            
            progressIndex = (progressIndex + 1) % progressMessages.length;
            if (progressIndex === 0) progressIndex = 1; // Skip the first message
            onProgress(progressMessages[progressIndex]);
        }
        
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation completed, but no download link was provided.");
        }
        
        onProgress("Downloading generated video...");
        // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);

        if (!response.ok) {
            throw new Error(`Failed to download video: ${response.statusText}`);
        }
        
        const blob = await response.blob();

        // Convert blob to data URL to store in state and use in <video> src
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
                onProgress("Video ready!");
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

    } catch (error) {
        console.error("Error generating video:", error);
        throw error; // Re-throw to be caught by the action handler
    }
};