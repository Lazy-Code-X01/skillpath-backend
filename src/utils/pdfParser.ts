import pdf from 'pdf-parse';

/**
 * Parses text from a PDF Buffer using pdf-parse.
 * @param fileBuffer Buffer containing PDF data
 * @returns Promise resolving to the pdf-parse Result
 */
export const parsePDF = async (fileBuffer: Buffer): Promise<pdf.Result> => {
  try {
    const data = await pdf(fileBuffer);
    return data;
  } catch (error) {
    console.error('Failed to parse PDF document:', error);
    throw error;
  }
};
