import { AddressConversion } from "../types";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export async function getPlacekeys(addresses: AddressConversion[]) {
  //This function will call the Placekey API to get the placekey for each address
  //It will add the placekey to the address object
  //It will return the updated address object
  for (const address of addresses) {
    var data = JSON.stringify({
      query: {
        street_address: address.street_address,
        city: address.city,
        region: address.region,
        postal_code: address.postal_code?.toString(),
        iso_country_code: address.iso_country_code,
      },
    });

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.placekey.io/v1/placekey",
      headers: {
        apikey: process.env.PLACEKEY_API_KEY || "",
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        address.placekey = response.data.placekey;
      })
      .catch(function (error) {
        console.log(error);
      });
    //This is a rate limit of 10 request per second
    await new Promise((r) => setTimeout(r, 100));
  }
  return addresses;
}
