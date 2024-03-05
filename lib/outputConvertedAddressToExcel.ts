import fs from "fs";
import path from "path";
import exceljs from "exceljs";
import { AddressConversion } from "../types";
import { P21Adress } from "./getP21Addresses";

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
    { header: "Original ID", key: "original_id", width: 20 },
    { header: "Original Address", key: "original_address", width: 20 },
    { header: "Street", key: "street_address", width: 20 },
    { header: "City", key: "city", width: 20 },
    { header: "State", key: "region", width: 10 },
    { header: "Zip", key: "postal_code", width: 10 },
    { header: "Country", key: "iso_country_code", width: 10 },
    { header: "Error", key: "error", width: 20 },
    { header: "Placekey", key: "placekey", width: 20 },
    { header: "Placekey Where", key: "placekeyWhere", width: 20 },
    { header: "P21 Address ID", key: "id", width: 20 },
    { header: "P21 Name", key: "name", width: 20 },
    { header: "P21 Address", key: "phys_address1", width: 20 },
    { header: "P21 City", key: "phys_city", width: 20 },
    { header: "P21 State", key: "phys_state", width: 10 },
    { header: "P21 Zip", key: "phys_postal_code", width: 10 },
    { header: "P21 Customer ID", key: "customer_id", width: 20 },
    { header: "P21 Placekey", key: "p21_placekey", width: 20 },
    { header: "P21 Placekey Where", key: "p21_placekeyWhere", width: 20 },
    { header: "P21 Salesrep ID", key: "salesrep_id", width: 20 },
    { header: "P21 Salesrep Name", key: "salesrep_name", width: 20 },
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
