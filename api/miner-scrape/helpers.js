const crypto = require("crypto");

const sha1 = (x) => crypto.createHash("sha1").update(x, "utf8").digest("hex");

module.exports ={
    sha1
}