import { Knex } from "knex";
import btc from '../json/btc_historic.json'
import spy from "../json/spy_historic.json";
import gld from "../json/gld_historic.json";

interface newSpyInterface {
  spy_date: string;
  spy_price: number | null;
}

interface newGldInterface {
  gld_date: string;
  gld_price: number | null;
}

let newSpy: newSpyInterface[] = [];
let newGld: newGldInterface[] = [];
// finds the missing weekend dates from the spy and gld seed and adds the btc date and a null price.
btc.map((x: { btc_date: string }) =>
  spy.map((s: { spy_date: string }) => s.spy_date).indexOf(x.btc_date) === -1
    ? newSpy.push({ spy_date: x.btc_date, spy_price: null })
    : ""
);
btc.map((x: { btc_date: string }) =>
  gld.map((s: { gld_date: string }) => s.gld_date).indexOf(x.btc_date) === -1
    ? newGld.push({ gld_date: x.btc_date, gld_price: null })
    : ""
);
// adds already existing dates
spy.map((x: { spy_date: string; spy_price: number }) =>
  newSpy.push({ spy_date: x.spy_date, spy_price: x.spy_price })
);
gld.map((x: { gld_date: string; gld_price: number }) =>
  newGld.push({ gld_date: x.gld_date, gld_price: x.gld_price })
);
//sorts by the date
newSpy.sort(
  (a, b) => (new Date(a.spy_date) as any) - (new Date(b.spy_date) as any)
);
newGld.sort(
  (a, b) => (new Date(a.gld_date) as any) - (new Date(b.gld_date) as any)
);

export const data = btc.map((_date: any, idx: number) => {
  return {
    date: btc[idx].btc_date,
    btc_price: btc[idx].btc_price,
    spy_price: newSpy[idx].spy_price,
    gld_price: newGld[idx].gld_price,
  };
});

export const seed = async (knex: Knex) => {
  return await knex("historical_prices").insert(data)
};
