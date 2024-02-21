import axios from "axios";
import { AddressConversion } from "../types";

export async function aiConvertAddresses(
  addresses: string[],
  countOfAddresses?: number
) {
  const convertedAddresses: AddressConversion[] = [];
  for (let i = 0; i < addresses.length; i++) {
    if (countOfAddresses !== undefined && i >= countOfAddresses) {
      break;
    }
    const address = addresses[i];
    const body = {
      raw: true,
      model: process.env.MODEL || "phi",
      stream: false,
      format: "json",
      options: {
        stop: ["Instruct:", "Output:"],
        temperature: 0,
        seed: 0,
      },
      prompt: `Instruct: Convert the address: ${address} to match this JSON Schema \n Schema: { "street_address": "street", "city": "city", "region": "state", "postal_code": "zipcode", "iso_country_code": "US" } \n The region should be the 2 character state abbreviation. The postal_code sshould be the 5 digit zipcode. Do not output anything besides the single JSON for this address.\nOutput:`,
    };

    const response = await axios.post(
      `${process.env.OLLAMA_URL || "http://127.0.0.1:11434"}/api/generate`,
      body
    );
    console.log("response: ", response.data.response);
    try {
      const parsedResponse = JSON.parse(response.data.response);
      parsedResponse["original_address"] = address;
      convertedAddresses.push(parsedResponse);
    } catch (error) {
      console.log("error: ", error);
      convertedAddresses.push({
        original_address: address,
        error: "Failed to convert address",
      });
    }
  }
  return convertedAddresses;
}
