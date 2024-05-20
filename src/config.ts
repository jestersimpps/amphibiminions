export const IMAGE_TYPE = 'png';
export const BASE_FOLDER = 'layers';
export const OUTPUT_PATH = 'output';
export const AMOUNT = 10;
export const STRUCTURE = {
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
    // special: {
    //     attributeName: 'special',
    //     prefix: 'special',
    //     rares: []
    // },


}