
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    isHealthy: {
      type: Type.BOOLEAN,
      description: "Is the plant in the image healthy?"
    },
    diseaseName: {
      type: Type.STRING,
      description: "The common name of the disease. If healthy, this should be 'Healthy'."
    },
    description: {
      type: Type.STRING,
      description: "A brief, easy-to-understand description of the disease or the plant's healthy state."
    },
    treatmentSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "A list of at least two actionable treatment suggestions. If healthy, provide two general care tips."
    }
  },
  required: ["isHealthy", "diseaseName", "description", "treatmentSuggestions"]
};

export const analyzeCropImage = async (imageFile: File): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = await fileToGenerativePart(imageFile);

  const prompt = `
    You are an expert agricultural scientist and plant pathologist.
    Analyze the provided image of a plant leaf.
    Identify the plant species and determine if it is healthy or diseased.
    If a disease is present, identify the disease, provide a brief description, and suggest at least two treatment options.
    If the plant is healthy, state that and provide two general care tips for the plant.
    Respond ONLY with a JSON object that conforms to the provided schema. Do not include any markdown formatting like \`\`\`json.
  `;
  
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
          parts: [
              { text: prompt },
              imagePart
          ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
      }
    });

    const jsonText = result.text.trim();
    const parsedResult: AnalysisResult = JSON.parse(jsonText);
    
    return parsedResult;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get a valid analysis from the AI model.");
  }
};
