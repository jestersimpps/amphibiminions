"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRUCTURE = exports.SCALING_FACTOR = exports.OUTPUT_PATH = exports.BASE_FOLDER = exports.IMAGE_TYPE = void 0;
exports.IMAGE_TYPE = 'png';
exports.BASE_FOLDER = 'layers';
exports.OUTPUT_PATH = 'output';
exports.SCALING_FACTOR = 700;
exports.STRUCTURE = {
    bodyFrame: {
        attributeName: 'body',
        prefix: 'body',
        rares: []
    },
    bodyColorMain: {
        attributeName: 'bodycolor',
        prefix: 'color',
        rares: []
    },
    bodyColorSecondary: {
        attributeName: 'accentcolor',
        prefix: 'color',
        rares: []
    },
    mouth: {
        attributeName: 'mouth',
        prefix: 'mouth',
        rares: [{
                'mouth1': 1
            }]
    },
    eyesBackground: {
        attributeName: 'eyecolor',
        prefix: 'eyes',
        rares: []
    },
    eyesForeground: {
        attributeName: 'eyetype',
        prefix: 'eyes',
        rares: []
    },
    hatHair: {
        attributeName: 'headcover',
        prefix: 'hat',
        rares: []
    },
};
//# sourceMappingURL=structure.js.map