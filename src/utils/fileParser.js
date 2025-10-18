import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extract text from PDF file
 */
export const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
};

/**
 * Extract text from Word document (.doc, .docx)
 */
export const extractTextFromWord = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from Word document:', error);
    throw new Error('Failed to parse Word document');
  }
};

/**
 * Extract text from Excel file (.xls, .xlsx)
 */
export const extractTextFromExcel = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    let fullText = '';

    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      fullText += csv + '\n';
    });

    return fullText;
  } catch (error) {
    console.error('Error extracting text from Excel file:', error);
    throw new Error('Failed to parse Excel file');
  }
};

/**
 * Extract text from CSV file
 */
export const extractTextFromCSV = async (file) => {
  try {
    const text = await file.text();
    const result = Papa.parse(text);
    return result.data.map(row => row.join(' ')).join('\n');
  } catch (error) {
    console.error('Error extracting text from CSV file:', error);
    throw new Error('Failed to parse CSV file');
  }
};

/**
 * Extract text from plain text or HTML files
 */
export const extractTextFromPlainText = async (file) => {
  try {
    const text = await file.text();
    // Remove HTML tags if present
    const cleanText = text.replace(/<[^>]*>/g, ' ');
    return cleanText;
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to parse text file');
  }
};

/**
 * Main function to parse any supported file type
 */
export const parseFile = async (file) => {
  const fileName = file.name.toLowerCase();
  const extension = fileName.split('.').pop();

  switch (extension) {
    case 'pdf':
      return await extractTextFromPDF(file);
    case 'doc':
    case 'docx':
      return await extractTextFromWord(file);
    case 'xls':
    case 'xlsx':
      return await extractTextFromExcel(file);
    case 'csv':
      return await extractTextFromCSV(file);
    case 'txt':
    case 'htm':
    case 'html':
      return await extractTextFromPlainText(file);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
};
