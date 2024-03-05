import { loadFirstColumn } from "./lib/loadFirstColumn";
import { aiConvertAddresses } from "./lib/aiConvertAddresses";
import { AddressConversion } from "./types";
import { writeConvertedAddressesToExcel } from "./lib/outputConvertedAddressToExcel";
import { getPlacekeys } from "./lib/getPlacekey";
import { loadAddressesFromExcel } from "./lib/loadAddressesFromExcel";
import crypto from "crypto";
import { getP21Addresses } from "./lib/getP21Addresses";
import { findAddressMatches } from "./lib/findAddressMatches";

async function main() {
  console.log(process.argv);
  const addressAlreadyConvertedFlag = process.argv.indexOf("-a") > -1;
  console.log(addressAlreadyConvertedFlag);
  let convertedAddresses: AddressConversion[] = [];
  if (addressAlreadyConvertedFlag) {
    console.log("Skipping address conversion");
    convertedAddresses = await loadAddressesFromExcel(
      process.argv[2] || "addresses.xlsx"
    );
  } else {
    const columnData = await loadFirstColumn(
      process.argv[2] || "addresses.xlsx"
    );
    convertedAddresses = await aiConvertAddresses(columnData);
  }
  console.log("Address count: ", convertedAddresses.length);
  console.log("getting placekeys");
  const placedAddresses = await getPlacekeys(convertedAddresses);
  const p21Addresses = await getP21Addresses();
  const matchedAddresses = findAddressMatches(placedAddresses, p21Addresses);

  await writeConvertedAddressesToExcel(
    matchedAddresses,
    process.argv[3] || `${crypto.randomUUID()}.xlsx`
  );
}

main();
