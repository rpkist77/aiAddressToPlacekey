import { loadFirstColumn } from "./lib/loadFirstColumn";
import { aiConvertAddresses } from "./lib/aiConvertAddresses";
import { AddressConversion } from "./types";
import { writeConvertedAddressesToExcel } from "./lib/outputConvertedAddressToExcel";
import { getPlacekeys } from "./lib/getPlacekey";
import crypto from "crypto";

async function main() {
  const columnData = await loadFirstColumn(process.argv[2] || "addresses.xlsx");
  const convertedAddresses: AddressConversion[] = await aiConvertAddresses(
    columnData
  );
  const placedAddresses = await getPlacekeys(convertedAddresses);
  await writeConvertedAddressesToExcel(
    placedAddresses,
    process.argv[3] || `${crypto.randomUUID()}.xlsx`
  );
}

main();
