import { OUTPUT_PATH_METADATA, BASE_URL } from "./config";
import * as fs from "fs";
const path = require("path");

// Function to update the base URL in JSON metadata files
async function updateBaseUrlInJsonFiles(newBaseUrl: string) {
  // Ensure the metadata directory exists
  if (!fs.existsSync(OUTPUT_PATH_METADATA)) {
    console.error(`Metadata directory ${OUTPUT_PATH_METADATA} does not exist.`);
    return;
  }

  // Read all JSON files in the metadata directory
  const files = fs.readdirSync(OUTPUT_PATH_METADATA).filter(file => file.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(OUTPUT_PATH_METADATA, file);
    const data = fs.readFileSync(filePath, 'utf-8');
    const jsonContent = JSON.parse(data);

    // Update the image URL
    const imageName = path.basename(jsonContent.image);
    jsonContent.image = `${newBaseUrl}/${imageName}`;

    // Write the updated JSON back to the file
    fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));
    console.log(`Updated ${file} with new base URL.`);
  }
}

// Call the function with the new base URL
const newBaseUrl = "https://lime-annual-cicada-507.mypinata.cloud/ipfs/QmRV6uSAKkRrd3aGxEVjeXLS9DcjUDDxXeHtNrm31yCiqs"; // Replace with your new base URL
updateBaseUrlInJsonFiles(newBaseUrl);
