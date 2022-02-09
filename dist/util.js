"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNumber = void 0;
const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};
exports.randomNumber = randomNumber;
//# sourceMappingURL=util.js.map