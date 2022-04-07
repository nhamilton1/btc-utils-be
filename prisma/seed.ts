import { PrismaClient } from "@prisma/client";
import btc from "./json/btc_historic.json";
import spy from "./json/spy_historic.json";
import gld from "./json/gld_historic.json";

const prisma = new PrismaClient();

interface newSpyInterface {
  spy_date: string;
  spy_price: number | null;
}

interface newGldInterface {
  gld_date: string;
  gld_price: number | null;
}

const main = async () => {
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

  const data = btc.map((_date: any, idx: number) => {
    return {
      date: btc[idx].btc_date,
      btc_price: btc[idx].btc_price,
      spy_price: newSpy[idx].spy_price,
      gld_price: newGld[idx].gld_price,
    };
  });

  for (let seed of data) {
      await prisma.historical_prices.create({
        data: seed
      })
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
