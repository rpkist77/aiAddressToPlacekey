import fs from "fs";
import path from "path";
import exceljs from "exceljs";
import { AddressConversion } from "../types";

// Assuming convertedAddresses is an array of objects
// where each object has properties: street, city, state, zip
export async function writeConvertedAddressesToExcel(
  convertedAddresses: AddressConversion[],
  outputFile: string
) {
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet("Converted Addresses");

  // Define columns for the worksheet
  worksheet.columns = [
    { header: "Original Address", key: "original_address", width: 30 },
    { header: "Street", key: "street_address", width: 30 },
    { header: "City", key: "city", width: 30 },
    { header: "State", key: "region", width: 10 },
    { header: "Zip", key: "postal_code", width: 10 },
    { header: "Country", key: "iso_country_code", width: 10 },
    { header: "Error", key: "error", width: 30 },
    { header: "Placekey", key: "placekey", width: 30 },
  ];

  // Add rows to the worksheet
  convertedAddresses.forEach((address) => {
    worksheet.addRow(address);
  });

  // Write to file
  const filePath = path.join("excel-out", outputFile);

  await workbook.xlsx.writeFile(filePath);

  console.log(`File is written at ${filePath}`);
}

// Usage
// writeConvertedAddressesToExcel(convertedAddresses);
