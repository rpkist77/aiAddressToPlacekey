import { AddressConversion } from "../types";
import dotenv from "dotenv";
import axios from "axios";
import { Address } from "exceljs";

dotenv.config();

var config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://api.placekey.io/v1/placekeys",
  headers: {
    apikey: process.env.PLACEKEY_API_KEY || "",
    "Content-Type": "application/json",
  },
  data: "",
};

export async function getPlacekeys(addresses: AddressConversion[]) {
  //This function will call the Placekey API to get the placekey for each address
  //It will add the placekey to the address object
  //It will return the updated address object

  //break addresses into chunks of 100
  //The Placekey API has a limit of 100 addresses per request
  const chunkedAddresses: AddressConversion[][] = [];
  const chunkSize = 100;
  for (let i = 0; i < addresses.length; i += chunkSize) {
    chunkedAddresses.push(addresses.slice(i, i + chunkSize));
  }

  //call the Placekey API for each chunk
  let chunkCount = 0;
  console.log("getting placekeys");
  for (const chunk of chunkedAddresses) {
    chunkCount++;
    const data = JSON.stringify({
      queries: chunk.map((address, index) => {
        return {
          query_id: index.toString(),
          street_address: address.street_address,
          city: address.city,
          region: address.region,
          postal_code: address.postal_code?.toString(),
          iso_country_code: address.iso_country_code,
        };
      }),
    });

    config.data = data;
    console.log("calling placekey api for chunk", chunkCount);
    await axios(config)
      .then(function (response) {
        console.log(
          "placekey response received of size: ",
          response.data.length
        );
        response.data.forEach(
          (res: {
            query_id: string;
            placekey: string | undefined;
            error: string | undefined;
          }) => {
            chunk[parseInt(res.query_id)].placekey = res.placekey;
            chunk[parseInt(res.query_id)].placekeyWhere =
              res.placekey?.split("@")[1];
            chunk[parseInt(res.query_id)].error = res.error;
          }
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  console.log("placekeys retrieved ");
  console.log("sample placekey: ", chunkedAddresses[0][5].placekey);

  //flatten the chunks back into a single array
  const flattenedAddresses = chunkedAddresses.flat();
  return flattenedAddresses;
}
