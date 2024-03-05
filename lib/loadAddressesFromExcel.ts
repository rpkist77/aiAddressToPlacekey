import fs from "fs";
import path from "path";
import exceljs from "exceljs";
import { AddressConversion } from "../types";

export async function loadAddressesFromExcel(
  filename: string
): Promise<AddressConversion[]> {
  const filePath = path.join("excel-in", filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `File ${filename} does not exist in the excel-in directory`
    );
  }

  const workbook = new exceljs.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];
  const columnData: AddressConversion[] = [];

  console.log("Loading addresses from excel");
  worksheet.eachRow((row, rowNumber) => {
    columnData.push({
      original_id: row.getCell(1).text,
      original_address: row.getCell(2).text,
      street_address: row.getCell(3).text,
      city: row.getCell(4).text,
      region: row.getCell(5).text,
      postal_code: row.getCell(6).text,
      iso_country_code: "US",
    });
  });
  console.log("Addresses loaded from excel");

  return columnData;
}
