import { IMAGE_TYPE, STRUCTURE, BASE_FOLDER, OUTPUT_PATH, AMOUNT } from "./config";
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
    // Clear existing images and generate a new collection of 10 NFTs
    this.clearImages();
    this.generateCollection(10);
  }

  // Method to clear existing images in the output directory
  clearImages() {
    // Check if the output directory exists; if not, create it
    if (!fs.existsSync(OUTPUT_PATH)) {
      fs.mkdirSync(OUTPUT_PATH);
    }
    // Read the files in the output directory
    fs.readdir(`./${OUTPUT_PATH}`, (err, files) => {
      if (err) throw err;
      // Loop through each file and delete it
      for (const file of files) {
        fs.unlink(path.join(OUTPUT_PATH, file), (err) => {
          if (err) throw err;
        });
      }
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
      const files = fs.readdirSync(`./layers/${attributeFolderName}`);
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
    fs.writeFile(
      `./output/${outputName}.png`,
      base64Image,
      { encoding: "base64" },
      function (err) {
        if (err) throw err;
        console.log(`${outputName}.png created`);
      }
    );
  }

  // Method to generate a collection of NFTs
  async generateCollection(amount: number, removeDuplicates = true) {
    for (let index = 0; index <= AMOUNT; index++) {
      // Generate a combination of traits
      const combination = this.loopTraits();
      // Combine the traits into a single image
      await this.combineTraits(combination.traits, combination.combinationId);
      console.log(combination);
    }
  }
}

// Instantiate the Generator class to start the NFT generation process
const generator = new Generator();
