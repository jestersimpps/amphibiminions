"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const structure_1 = require("./structure");
const fs = require("fs");
const util_1 = require("./util");
const Canvas = require('canvas');
const mergeImages = require("merge-images-v2");
const scalePixelArt = require("scale-pixel-art");
const path = require('path');
class Generator {
    constructor() {
        this.clearImages();
        this.generateCollection(10);
    }
    clearImages() {
        fs.readdir(`./${structure_1.OUTPUT_PATH}`, (err, files) => {
            if (err)
                throw err;
            for (const file of files) {
                fs.unlink(path.join(structure_1.OUTPUT_PATH, file), err => {
                    if (err)
                        throw err;
                });
            }
        });
    }
    pickRandom(array) {
        return (0, util_1.randomNumber)(0, array.length - 1);
    }
    loopTraits() {
        let combinationId = '';
        let traits = [];
        Object.keys(structure_1.STRUCTURE).forEach(attributeFolderName => {
            const attributeConfig = structure_1.STRUCTURE[attributeFolderName];
            const files = fs.readdirSync(`./layers/${attributeFolderName}`);
            const imageFiles = files.filter(f => f.endsWith(structure_1.IMAGE_TYPE)).map(f => `./${structure_1.BASE_FOLDER}/${attributeFolderName}/${f}`);
            const traitIndex = this.pickRandom(imageFiles);
            const fileName = imageFiles[traitIndex];
            traits = [...traits, Object.assign({ fileName }, attributeConfig)];
            combinationId += traitIndex;
        });
        return { combinationId, traits };
    }
    combineTraits(traits, outputName) {
        return __awaiter(this, void 0, void 0, function* () {
            const traitImages = traits.map(t => t.fileName).filter(t => !!t);
            const mergedImages = yield mergeImages(traitImages, { Canvas: Canvas });
            const base64Image = mergedImages.split(';base64,').pop();
            fs.writeFile(`./output/${outputName}.png`, base64Image, { encoding: 'base64' }, function (err) {
                console.log(`${outputName}.png created`);
            });
        });
    }
    generateCollection(amount, removeDuplicates = true) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index <= amount; index++) {
                const combination = this.loopTraits();
                yield this.combineTraits(combination.traits, combination.combinationId);
                console.log(combination);
            }
        });
    }
}
const generator = new Generator();
//# sourceMappingURL=main.js.map