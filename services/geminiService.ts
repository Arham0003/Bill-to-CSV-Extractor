
import { GoogleGenAI, Type } from '@google/genai';
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
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = await fileToGenerativePart(imageFile);

  const prompt = `
    Analyze the provided image of a bill, invoice, or spreadsheet. 
    Extract all product or item entries listed.
    For each item, identify the corresponding values for the fields defined in the JSON schema.
    If a value for a specific field cannot be found or is not applicable, use null for that field.
    Ensure the output is a valid JSON array of objects matching the schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }, imagePart] },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Product name' },
            hsn_code: { type: Type.STRING, description: 'HSN code', nullable: true },
            category: { type: Type.STRING, description: 'Product category', nullable: true },
            batch_number: { type: Type.STRING, description: 'Batch number', nullable: true },
            manufacturer: { type: Type.STRING, description: 'Manufacturer', nullable: true },
            expiry_date: { type: Type.STRING, description: 'Expiry date (YYYY-MM-DD)', nullable: true },
            quantity: { type: Type.NUMBER, description: 'Quantity of the product', nullable: true },
            purchase_price: { type: Type.NUMBER, description: 'Price per unit purchased', nullable: true },
            selling_price: { type: Type.NUMBER, description: 'Price per unit for selling', nullable: true },
            gst: { type: Type.NUMBER, description: 'GST percentage', nullable: true },
            supplier: { type: Type.STRING, description: 'Supplier name', nullable: true },
            low_stock_threshold: { type: Type.NUMBER, description: 'Low stock warning level', nullable: true },
          },
        },
      },
    },
  });
  
  const text = response.text;
  if (!text) {
      throw new Error("API returned no text response.");
  }

  try {
      const parsedData = JSON.parse(text);
      return parsedData as Product[];
  } catch(e) {
      console.error("Failed to parse JSON response:", text);
      throw new Error("Could not parse the data from the AI. The format was unexpected.");
  }
};
