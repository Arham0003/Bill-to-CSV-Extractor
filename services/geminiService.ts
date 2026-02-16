
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import type { Product } from '../types';

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

export const extractDataFromImage = async (imageFile: File): Promise<Product[]> => {
  if (!import.meta.env.VITE_VERCEL_AI_GATEWAY_API_KEY) {
    throw new Error("VITE_VERCEL_AI_GATEWAY_API_KEY environment variable is not set.");
  }

  // Create OpenAI client configured for Vercel AI Gateway
  const openai = createOpenAI({
    baseURL: 'https://ai-gateway.vercel.sh/v1',
    apiKey: import.meta.env.VITE_VERCEL_AI_GATEWAY_API_KEY,
  });

  const imagePart = await fileToGenerativePart(imageFile);

  const prompt = `
    Analyze the provided image of a bill, invoice, or spreadsheet. 
    Extract all product or item entries listed.
    For each item, identify the corresponding values for the fields defined in the JSON schema.
    If a value for a specific field cannot be found or is not applicable, use null for that field.
    Ensure the output is a valid JSON array of objects matching the schema.
    
    Image data: data:${imageFile.type};base64,${imagePart.inlineData.data}
  `;

  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'), // Using GPT-4o-mini through Vercel AI Gateway
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt }
          ]
        }
      ],
      temperature: 0.7,
    });

    if (!text) {
      throw new Error("API returned no text response.");
    }

    // Parse the JSON response
    const parsedData = JSON.parse(text);
    return parsedData as Product[];
    
  } catch(e) {
    console.error("Failed to parse JSON response:", e);
    throw new Error("Could not parse the data from the AI. The format was unexpected.");
  }
};
