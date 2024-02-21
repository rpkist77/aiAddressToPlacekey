import fs from "fs";
import path from "path";
import exceljs from "exceljs";

export async function loadFirstColumn(filename: string): Promise<string[]> {
  const filePath = path.join("excel-in", filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `File ${filename} does not exist in the excel-in directory`
    );
  }

  const workbook = new exceljs.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];
  const columnData: string[] = [];
  worksheet.eachRow((row, rowNumber) => {
    columnData.push(row.getCell(1).text);
  });

  return columnData;
}
