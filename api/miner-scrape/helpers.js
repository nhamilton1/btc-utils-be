const crypto = require("crypto");

const sha1 = (x) => crypto.createHash("sha1").update(x, "utf8").digest("hex");

//converts mfb J/th into watts
const convertPowerDraw = (powerString, th) => {
  if (powerString.includes("J")) {
    let watts = Number(powerString.split(/j\/th/i)[0]);
    let hash = Number(th.split(/th/i)[0]);
    return watts * hash;
  } else {
    let watts = Number(powerString.split(/w/i)[0]);
    return watts;
  }
};

const convertEfficiency = (powerString, th) => {
  if (powerString.includes("J")) {
    let efficency = Number(powerString.split(/j\/th/i)[0]);
    return efficency
  } else {
    let watts = Number(powerString.split(/w/i)[0]);
    let hash = Number(th.split(/th/i)[0]);
    return Math.ceil(watts/hash);
  }
};

module.exports = {
  sha1,
  convertPowerDraw,
  convertEfficiency,
};
