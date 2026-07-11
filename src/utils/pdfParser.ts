import fs from 'fs';
import pdfParse from 'pdf-parse';

export const extractTextFromPDF = async (filePath: string): Promise<{ text: string; pageCount: number }> => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return {
    text: data.text,
    pageCount: data.numpages,
  };
};

export const cleanupFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Failed to delete temp file:', error);
  }
};
