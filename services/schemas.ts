import { Type } from "@google/genai";

export const slideSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The main title of the slide."
    },
    bulletPoints: {
      type: Type.ARRAY,
      description: "A list of key points for the slide content. Should be concise.",
      items: {
        type: Type.STRING
      }
    },
    imagePrompt: {
        type: Type.STRING,
        description: "A descriptive prompt for an AI image generator. Provide this ONLY if a suitable imageUrl cannot be found from a web search."
    },
    imageUrl: {
        type: Type.STRING,
        description: "A URL for a relevant, high-quality, royalty-free image found via web search. Provide this instead of an imagePrompt if a suitable image is found."
    }
  },
  required: ["title", "bulletPoints"]
};

export const presentationSchema = {
  type: Type.OBJECT,
  properties: {
    slides: {
      type: Type.ARRAY,
      description: "An array of slide objects.",
      items: slideSchema
    }
  },
  required: ["slides"]
};