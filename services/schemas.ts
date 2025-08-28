import { Type } from "@google/genai";

export const chartSchema = {
  type: Type.OBJECT,
  description: "Data for rendering a chart. Provide this if the user asks to create a visualization like a bar chart, line chart, or pie chart. When creating a chart, the slide's main bullet points should be cleared.",
  properties: {
    type: { type: Type.STRING, enum: ["bar", "line", "pie"], description: "The type of chart to render." },
    title: { type: Type.STRING, description: "A title for the chart, which may differ from the slide title." },
    data: {
      type: Type.ARRAY,
      description: "An array of data points for the chart. Each object should have a 'name' for the label and a value key.",
      items: {
        type: Type.OBJECT,
        // Using a more flexible schema for data items
        properties: {},
        additionalProperties: true,
      }
    },
    dataKey: { type: Type.STRING, description: "The key in the data objects that holds the numerical value (e.g., 'sales')." },
    color: { type: Type.STRING, description: "A hex color code (e.g., '#8884d8') for the chart's primary visual elements (bars, lines, pie slices)." }
  },
  required: ["type", "title", "data", "dataKey"]
};


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
        description: "A descriptive prompt for an AI image generator. Provide this ONLY if a suitable image cannot be found from a web search."
    },
    videoPrompt: {
        type: Type.STRING,
        description: "A descriptive prompt for an AI video generator. Provide this ONLY if the user explicitly asks for a video or animation. This is a premium feature, use it sparingly."
    },
    imageSearchResults: {
        type: Type.ARRAY,
        description: "A list of up to 3 relevant, high-quality, royalty-free images found via web search. Each item should be an object with a 'url' and a 'title'. Provide this instead of an imagePrompt if suitable images are found.",
        items: {
            type: Type.OBJECT,
            properties: {
                url: { type: Type.STRING },
                title: { type: Type.STRING }
            },
            required: ["url", "title"]
        }
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

export const slideContentSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
        type: Type.STRING,
        description: "The regenerated slide title."
        },
        bulletPoints: {
        type: Type.ARRAY,
        description: "A list of regenerated bullet points.",
        items: { type: Type.STRING }
        }
    },
    required: ["title", "bulletPoints"]
};

export const factCheckSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The fact-checked and updated slide title."
    },
    bulletPoints: {
      type: Type.ARRAY,
      description: "A list of fact-checked and updated bullet points.",
      items: { type: Type.STRING }
    },
    summaryOfChanges: {
      type: Type.STRING,
      description: "A brief summary explaining the changes made and the reasoning behind them."
    }
  },
  required: ["title", "bulletPoints", "summaryOfChanges"]
};

export const adaptAudienceSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The rewritten slide title, adapted for the target audience."
    },
    bulletPoints: {
      type: Type.ARRAY,
      description: "A list of rewritten bullet points, adapted for the target audience.",
      items: { type: Type.STRING }
    }
  },
  required: ["title", "bulletPoints"]
};