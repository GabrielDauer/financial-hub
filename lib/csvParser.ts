import * as Papa from "papaparse";

export function parseCSV(content: string): Record<string, string>[] {
  const result = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data as Record<string, string>[];
}