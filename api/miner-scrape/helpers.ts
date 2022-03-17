import { createHash } from "crypto";

export const sha1 = (x: string):string => createHash("sha1").update(x, "utf8").digest("hex");

//converts mfb J/th into watts
export const convertPowerDraw = (powerString: string, th: string):number => {
  if (powerString.includes("J")) {
    let watts = Number(powerString.split(/j\/th/i)[0]);
    let hash = Number(th.split(/th/i)[0]);
    return watts * hash;
  } else {
    let watts = Number(powerString.split(/w/i)[0]);
    return watts;
  }
};

export const convertEfficiency = (powerString: string, th: string):number => {
  if (powerString.includes("J")) {
    let efficency = Number(powerString.split(/j\/th/i)[0]);
    return efficency
  } else {
    let watts = Number(powerString.split(/w/i)[0]);
    let hash = Number(th.split(/th/i)[0]);
    return Math.ceil(watts/hash);
  }
};
