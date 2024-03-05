import { AddressConversion } from "../types";
import { P21Adress } from "./getP21Addresses";

export function findAddressMatches(
  importedAddresses: AddressConversion[],
  p21Addresses: P21Adress[]
) {
  //This function will compare the address imported from the excel file with the address in P21
  //It will do this via the placekeyWhere field and the street number on the address

  console.log("matching addresses");
  console.log("sample imported address: ", importedAddresses[5]);
  const matchedAddresses = importedAddresses.map((importedAddress) => {
    const result = {
      importedAddress: importedAddress,
      p21Address: p21Addresses.find((p21Address) => {
        return (
          p21Address.p21_placekeyWhere === importedAddress.placekeyWhere &&
          p21Address.phys_address1.split(" ")[0] ===
            importedAddress.street_address?.split(" ")[0]
        );
      }),
    };
    return result;
  });

  console.log("finished matching addresses");
  console.log("sample matched address: ", matchedAddresses[5]);

  //flatten the objects in the array into single columns
  const flattenedAddresses = matchedAddresses.map((address) => {
    return {
      ...address.importedAddress,
      ...address.p21Address,
    };
  });

  return flattenedAddresses;
}
