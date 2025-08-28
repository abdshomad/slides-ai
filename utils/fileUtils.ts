// FIX: Correct import path for types
import { FilePart } from '../types/index';

export const convertFileToGenerativePart = (file: File): Promise<FilePart> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(',')[1];
      if (base64Data) {
        resolve({
          inlineData: {
            mimeType: file.type,
            data: base64Data,
          },
        });
      } else {
        reject(new Error("Failed to read file as base64."));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export const convertFileToBase64WithProgress = (
  file: File,
  onProgress: (progress: number) => void
): Promise<{ data: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentLoaded = Math.round((event.loaded / event.total) * 100);
        onProgress(percentLoaded);
      }
    };
    
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(',')[1];
      if (base64Data) {
        onProgress(100);
        resolve({
          data: base64Data,
          mimeType: file.type,
        });
      } else {
        reject(new Error("Failed to read file as base64."));
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};


export const fetchImageAsBase64 = async (imageUrl: string): Promise<string> => {
  // NOTE: This can fail due to CORS policy on the remote server.
  // In a production environment, a server-side proxy would be required to bypass this.
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64Data = dataUrl.split(',')[1];
        if (base64Data) {
          resolve(base64Data);
        } else {
          reject(new Error("Failed to convert fetched image to base64."));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Error fetching image from URL (${imageUrl}):`, error);
    return ""; // Return empty string on failure
  }
};