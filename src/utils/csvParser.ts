// src/utils/csvParser.ts

/**
 * Parses a CSV string into an array of objects.
 * Assumes the first row is the header.
 *
 * @param csvString The CSV data as a string.
 * @returns An array of objects, where each object represents a row
 * and keys are derived from the CSV header.
 */
export function parseCsv<T>(csvString: string): T[] {
  const lines = csvString.trim().split('\n');
  if (lines.length === 0) {
    return [];
  }

  // Extract headers, trim whitespace, and handle the leading empty/index column
  let rawHeaders = lines[0].split(',').map(header => header.trim());
  let headers: string[] = [];
  if (rawHeaders[0] === '') { // If the first column is empty (like your CSV)
    headers = rawHeaders.slice(1); // Skip the empty header
  } else if (rawHeaders[0].match(/^\d+$/)) { // If the first column is just an '0'
    headers = rawHeaders.slice(1); // Skip the index header
  } else if (rawHeaders[0].match(/^\d+,/)) { // If the first column is '0,city'
    headers = [rawHeaders[0].split(',')[1], ...rawHeaders.slice(1)]; // Take 'city' part and rest
  } else {
    headers = rawHeaders;
  }

  const result: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].trim();
    if (currentLine === '') continue; // Skip empty lines

    const values = currentLine.split(',');
    const obj: { [key: string]: any } = {};

    // Adjust value index if the first column in the data rows is an index
    let valueStartIndex = 0;
    if (values.length > headers.length) { // If there's an extra column (the index)
      valueStartIndex = 1;
    }

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const value = values[j + valueStartIndex]; // Adjust index for values
      if (header && value !== undefined) {
        // Attempt to convert to number if applicable, otherwise keep as string
        obj[header] = isNaN(Number(value)) ? value : Number(value);
      }
    }
    result.push(obj as T);
  }

  return result;
}
