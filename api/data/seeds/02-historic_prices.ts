const btc = require("../json/btc_historic.json");
const spy = require("../json/spy_historic.json");
const gld = require("../json/gld_historic.json");

let newSpy = [];
let newGld = [];
// finds the missing weekend dates from the spy and gld seed and adds the btc date and a null price.
btc.map((x) =>
  spy.map((s) => s.spy_date).indexOf(x.btc_date) === -1
    ? newSpy.push({ spy_date: x.btc_date, spy_price: null })
    : ""
);
btc.map((x) =>
  gld.map((s) => s.gld_date).indexOf(x.btc_date) === -1
    ? newGld.push({ gld_date: x.btc_date, gld_price: null })
    : ""
);
// adds already existing dates
spy.map((x) => newSpy.push({ spy_date: x.spy_date, spy_price: x.spy_price }));
gld.map((x) => newGld.push({ gld_date: x.gld_date, gld_price: x.gld_price }));
//sorts by the date
newSpy.sort((a, b) => new Date(a.spy_date) - new Date(b.spy_date));
newGld.sort((a, b) => new Date(a.gld_date) - new Date(b.gld_date));

const data = btc.map((date, idx) => {
  return {
    date: btc[idx].btc_date,
    btc_price: btc[idx].btc_price,
    spy_price: newSpy[idx].spy_price,
    gld_price: newGld[idx].gld_price,
  };
});

exports.data = data;

exports.seed = async (knex) => {
  return await knex("historical_prices").insert(data);
};
