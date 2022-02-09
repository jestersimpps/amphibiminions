import { IMAGE_TYPE, STRUCTURE, BASE_FOLDER, SCALING_FACTOR, OUTPUT_PATH } from "./structure";
import * as fs from 'fs';
import { randomNumber } from "./util";
const Canvas = require('canvas');
import * as mergeImages from 'merge-images-v2';
const scalePixelArt = require("scale-pixel-art")
const path = require('path');

interface Trait {
    fileName: string;
    attributeName: string; prefix: string;
}


class Generator {

    constructor() {
        this.clearImages();
        this.generateCollection(10);
    }

    clearImages() {
        fs.readdir(`./${OUTPUT_PATH}`, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(OUTPUT_PATH, file), err => {
                    if (err) throw err;
                });
            }
        });
    }

    pickRandom(array) {
        return randomNumber(0, array.length - 1);
    }

    loopTraits(): { combinationId: string, traits: Trait[], } {
        let combinationId = '';
        let traits = [];
        Object.keys(STRUCTURE).forEach(attributeFolderName => {
            // TODO: rares
            const attributeConfig = STRUCTURE[attributeFolderName];
            const files = fs.readdirSync(`./layers/${attributeFolderName}`);
            const imageFiles = files.filter(f => f.endsWith(IMAGE_TYPE)).map(f => `./${BASE_FOLDER}/${attributeFolderName}/${f}`);
            const traitIndex = this.pickRandom(imageFiles)
            const fileName = imageFiles[traitIndex];
            traits = [...traits, { fileName, ...attributeConfig }]
            combinationId += traitIndex;

        })
        return { combinationId, traits }
    }

    async combineTraits(traits: Trait[], outputName: string) {
        const traitImages = traits.map(t => t.fileName).filter(t => !!t);
        const mergedImages = await mergeImages(traitImages, { Canvas: Canvas });
        const base64Image = mergedImages.split(';base64,').pop()

        fs.writeFile(`./output/${outputName}.png`, base64Image, { encoding: 'base64' }, function (err) {
            console.log(`${outputName}.png created`);
        });
    }

    async generateCollection(amount: number, removeDuplicates = true) {
        for (let index = 0; index <= amount; index++) {
            const combination = this.loopTraits();
            await this.combineTraits(combination.traits, combination.combinationId)
            console.log(combination)
        }
    }


}

const generator = new Generator();