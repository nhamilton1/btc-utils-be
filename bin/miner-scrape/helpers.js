"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertEfficiency = exports.convertPowerDraw = exports.sha1 = void 0;
const crypto_1 = require("crypto");
const sha1 = (x) => (0, crypto_1.createHash)("sha1").update(x, "utf8").digest("hex");
exports.sha1 = sha1;
//converts mfb J/th into watts
const convertPowerDraw = (powerString, th) => {
    if (powerString.includes("J")) {
        let watts = Number(powerString.split(/j\/th/i)[0]);
        let hash = Number(th.split(/th/i)[0]);
        return watts * hash;
    }
    else {
        let watts = Number(powerString.split(/w/i)[0]);
        return watts;
    }
};
exports.convertPowerDraw = convertPowerDraw;
const convertEfficiency = (powerString, th) => {
    if (powerString.includes("J")) {
        let efficency = Number(powerString.split(/j\/th/i)[0]);
        return efficency;
    }
    else {
        let watts = Number(powerString.split(/w/i)[0]);
        let hash = Number(th.split(/th/i)[0]);
        return Math.ceil(watts / hash);
    }
};
exports.convertEfficiency = convertEfficiency;
