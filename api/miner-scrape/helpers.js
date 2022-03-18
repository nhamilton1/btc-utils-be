"use strict";
exports.__esModule = true;
exports.convertEfficiency = exports.convertPowerDraw = exports.sha1 = void 0;
var crypto_1 = require("crypto");
var sha1 = function (x) { return (0, crypto_1.createHash)("sha1").update(x, "utf8").digest("hex"); };
exports.sha1 = sha1;
//converts mfb J/th into watts
var convertPowerDraw = function (powerString, th) {
    if (powerString.includes("J")) {
        var watts = Number(powerString.split(/j\/th/i)[0]);
        var hash = Number(th.split(/th/i)[0]);
        return watts * hash;
    }
    else {
        var watts = Number(powerString.split(/w/i)[0]);
        return watts;
    }
};
exports.convertPowerDraw = convertPowerDraw;
var convertEfficiency = function (powerString, th) {
    if (powerString.includes("J")) {
        var efficency = Number(powerString.split(/j\/th/i)[0]);
        return efficency;
    }
    else {
        var watts = Number(powerString.split(/w/i)[0]);
        var hash = Number(th.split(/th/i)[0]);
        return Math.ceil(watts / hash);
    }
};
exports.convertEfficiency = convertEfficiency;
