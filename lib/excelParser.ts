import * as XLSX from "xlsx";

export function parseExcel(buffer: ArrayBuffer) {
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheet];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
}