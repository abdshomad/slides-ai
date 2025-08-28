import { GoogleGenAI } from "@google/genai";

// Initialize the Google AI client with the API key from environment variables.
// This single instance is exported and used across all service files.
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
