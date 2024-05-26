import { IMAGE_TYPE, STRUCTURE, BASE_FOLDER, OUTPUT_PATH, AMOUNT, BASE_URL, NAME, OUTPUT_PATH_METADATA } from "./config";
import * as fs from "fs";
const Canvas = require("canvas");
import * as mergeImages from "merge-images-v2";
const path = require("path");

// Interface to define the structure of a Trait
interface Trait {
  fileName: string;
  attributeName: string;
  prefix: string;
}

// Function to generate a random number between min and max
const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

// Generator class to handle the NFT generation process
class Generator {
  constructor() {
    // Clear existing images and generate a new collection of NFTs
    this.clearImages();
    this.generateCollection(AMOUNT);
  }

  // Method to clear existing images in the output directory
  clearImages() {
    // Check if the output directory exists; if not, create it
    if (!fs.existsSync(OUTPUT_PATH)) {
      fs.mkdirSync(OUTPUT_PATH);
    }
    // Read the files in the output directory
    fs.readdirSync(`./${OUTPUT_PATH}`).forEach((file) => {
      fs.unlinkSync(path.join(OUTPUT_PATH, file));
    });
  }

  // Method to pick a random element from an array
  pickRandom(array) {
    return randomNumber(0, array.length - 1);
  }

  // Method to loop through traits and create a combination of traits
  loopTraits(): { combinationId: string; traits: Trait[] } {
    let combinationId = "";
    let traits = [];
    // Loop through each attribute folder defined in STRUCTURE
    Object.keys(STRUCTURE).forEach((attributeFolderName) => {
      // Get the configuration for the current attribute
      const attributeConfig = STRUCTURE[attributeFolderName];
      // Read the files in the attribute folder
      const files = fs.readdirSync(`./${BASE_FOLDER}/${attributeFolderName}`);
      // Filter and map the image files in the folder
      const imageFiles = files
        .filter((f) => f.endsWith(IMAGE_TYPE))
        .map((f) => `./${BASE_FOLDER}/${attributeFolderName}/${f}`);
      // Pick a random image file
      const traitIndex = this.pickRandom(imageFiles);
      const fileName = imageFiles[traitIndex];
      // Add the selected trait to the traits array
      traits = [...traits, { fileName, ...attributeConfig }];
      // Append the trait index to the combination ID
      combinationId += traitIndex;
    });
    return { combinationId, traits };
  }

  // Method to combine traits into a single image
  async combineTraits(traits: Trait[], outputName: string) {
    // Get the file names of the traits
    const traitImages = traits.map((t) => t.fileName).filter((t) => !!t);
    // Merge the trait images into a single image
    const mergedImages = await mergeImages(traitImages, { Canvas: Canvas });
    // Extract the base64-encoded image data
    const base64Image = mergedImages.split(";base64,").pop();

    // Write the merged image to the output directory
    await fs.promises.writeFile(
      `./${OUTPUT_PATH}/${outputName}.png`,
      base64Image,
      { encoding: "base64" }
    );
    console.log(`${outputName}.png created`);
  }

  // Method to generate a JSON metadata file for each image
  async generateJsonFile(index: number, traits: Trait[]) {
    const attributes = traits.map(trait => ({
      trait_type: trait.prefix,
      value: path.basename(trait.fileName, path.extname(trait.fileName))
    }));

    const jsonContent = {
      description: `A unique ${NAME} with traits like ${attributes.map(attribute => attribute.value).join(", ")}.`,
      image: `${BASE_URL}/${index}.${IMAGE_TYPE}`,
      name: `${NAME} #${index}`,
      attributes: attributes,
    };

    if (!fs.existsSync(OUTPUT_PATH_METADATA)) {
      fs.mkdirSync(OUTPUT_PATH_METADATA);
    }
    await fs.promises.writeFile(`${OUTPUT_PATH_METADATA}/${index}.json`, JSON.stringify(jsonContent, null, 2));
    console.log(`${index}.json created`);
  }

  // Method to generate a collection of NFTs
  async generateCollection(amount: number) {
    for (let index = 1; index <= amount; index++) { // Start index from 1 for sequential naming
      try {
        // Generate a combination of traits
        const combination = this.loopTraits();
        // Combine the traits into a single image with sequential file name
        await this.combineTraits(combination.traits, index.toString());
        await this.generateJsonFile(index, combination.traits);

        console.log(`Image ${index} created with combination:`, combination);
      } catch (error) {
        console.error(`Error generating image ${index}:`, error);
      }
    }
  }
}

// Instantiate the Generator class to start the NFT generation process
new Generator();
