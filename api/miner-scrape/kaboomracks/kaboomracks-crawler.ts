import axios from "axios";
import moment from "moment";
import { sha1 } from "../helpers";
import { asicWattList } from "../asicWattList";
import { load } from "cheerio";

export interface kaboomracksInterface {
  vendor: string;
  model: string;
  th: number;
  watts: number;
  efficiency: number;
  price: number;
  date: Date;
  id: string;
}

const kaboomracksScraper = async () => {
  try {
    const { data } = await axios.get("https://t.me/s/kaboomracks");

    const $miner = load(data);

    const asics: kaboomracksInterface[] = [];

    $miner(
      "body > main > div > section > div > div > div > div.tgme_widget_message_text"
    ).each((_idx, el) => {
      let minerData = $miner(el).text();

      // this will filter out any posts that do not each in them
      // they sell by lots some times.
      const individualSales = minerData.match(/(?=[—]\s*).*?(?=\s*each —)/gs);
      let moq = minerData.match(/(?=order \s*).*?(?=\s*ship)/g);

      //adding this because it was messing up the regex, had to account for lot
      //tests for outliers for moq
      if (moq === null) {
        moq =
          minerData.match(/(?=each \s*).*?(?<=\s*lot)/g) !== null
            ? minerData.match(/(?=each \s*).*?(?<=\s*lot)/g)
            : minerData.match(/(?=minimum \s*).*?(?<=\s*Contact)/g);
      }

      //TODO: TEST OUT THIS MOQ
      const moqTest = moq?.map((ele): (number | null)[] =>
        ele
          .split(" ")
          .map((n: string): number | null => {
            return typeof n === "string" && !Number.isNaN(Number(n))
              ? Number(n)
              : null;
          })
          .filter((i): number | null => i)
      )[0];

      if (
        //might have to change this so it includes T versions
        minerData.includes("Antminer S") &&
        individualSales != null &&
        moqTest![0] === 1
      ) {
        let vendor = "Kaboomracks";
        //adding price array for when they have multiple prices, takes last one in the array. they striked out a price to show a discount
        let priceArray = minerData
          .match(/(?<=[$]\s*).*?(?=\s*each —)/gs)![0]
          .split(" ");

        let price = Number(
          priceArray[priceArray.length - 1].replace(/[^.\d]/g, "")
        );

        // new way to check for date, if date is not valid it trys a different way
        // usually there are two | which caused it to break
        let date = moment(
          new Date(
            minerData
              .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)![0]
              .replace(/[^\x20-\x7E]/g, "")
              .split(" ")
              .map((day) => (day.includes(",") ? day.slice(0, -3) : day))
              .join(" ")
          )
        ).isValid()
          ? new Date(
              moment(
                new Date(
                  minerData
                    .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)![0]
                    .replace(/[^\x20-\x7E]/g, "")
                    .split(" ")
                    .map((day) => (day.includes(",") ? day.slice(0, -3) : day))
                    .join(" ")
                )
              ).format("MM-DD-YYYY")
            )
          : new Date(
              moment(
                new Date(
                  minerData
                    .match(/(?<=usa\s+).*?(?=\s+Miners for)/gs)![0]
                    .replace(/[^\x20-\x7E]/g, "")
                    .replace("| ", "")
                    .split(" ")
                    .map((day) => (day.includes(",") ? day.slice(0, -3) : day))
                    .join(" ")
                )
              ).format("MM-DD-YYYY")
            );

        //this will find between the given strings, for exmample here:
        //will find between Antminer S and for
        let asicModel = minerData.match(/(?=Antminer S\s*).*?(?=\s*for)/gs)![0];
        //gets the asic name without the th
        let asicSearchName = minerData
          .match(/(?=Bitmain Antminer S\s*).*?(?=\s*T)/gs)![0]
          .split(" ")
          .slice(0, -1)
          .join(" ");

        if (asicModel.includes("T") && !asicModel.includes("(")) {
          let th = Number(
            asicModel
              .split(" ")
              .filter((e) =>
                e.includes("T") && Number.isInteger(Number(e[0])) ? e[0] : null
              )[0]
              .replace("T", "")
          );
            
          const asicName = asicModel.match(/(?=Antminer S\s*).*?(?=\s*T)/gs);

          //gets the watts from the asic watt list, remove the t from the th var
          //if there isnt a match it will take the wt and * it by the th
          let watts =
            asicWattList[asicSearchName][th] !== undefined
              ? asicWattList[asicSearchName][th]
              : asicWattList[asicSearchName]["wt"] * Number(th);

          //added tofixed, was getting a really long decimal place
          let efficiency = Number((watts / th).toFixed(1));
          let model = `${asicName![0]}T`;
          let id = vendor + model + price + date;
          asics.push({
            vendor,
            model,
            th,
            watts,
            efficiency,
            price,
            date,
            id: sha1(id),
          });
        } else if (asicModel.includes("(")) {
          //had to add this for inconsistant post with S9s with th like (13.5Th/s)
          //and had to fix how the date was pulled. Still might have to add another
          //statement for when just Th/s is used
          let date = new Date(
            minerData
              .match(/(?<=#usa [|]\s+).*?(?=\s+Miners)/gs)![0]
              //removes the invalid chars
              .replace(/[^\x20-\x7E]/g, "")
              .split(" ")
              .map((day) => (day.includes(",") ? day.slice(0, -3) : day))
              .join(" ")
          );

          date = new Date(moment(new Date(date)).format("MM-DD-YYYY"));
          let th = Number(
            asicModel
              .split(" ")
              .filter((e) => e.includes("("))[0]
              .replace("(", "")
          );
          const asicName = asicModel
            .match(/(?=Antminer S\s*).*?(?=\s*T)/gs)![0]
            .replace("(", "");

          let watts =
            asicWattList[asicSearchName][th] !== undefined
              ? asicWattList[asicSearchName][th]
              : asicWattList[asicSearchName]["wt"] * Number(th);

          let efficiency = watts / th;
          let model = `${asicName}T`;
          let id = vendor + model + price + date;

          asics.push({
            vendor,
            model,
            th,
            watts,
            efficiency,
            price,
            date,
            id: sha1(id),
          });
        }
      }

      if (
        minerData.includes("Whatsminer M") &&
        individualSales != null &&
        moqTest![0] === 1
      ) {
        let vendor = "Kaboomracks";
        let price = Number(
          minerData.match(/(?<=[$]\s*).*?(?=\s*each —)/gs)![0]
        );
        let date = new Date(
          minerData
            .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)![0]
            .replace(/[^\x20-\x7E]/g, "")
            .split(" ")
            .map((day) => (day.includes(",") ? day.slice(0, -3) : day))
            .join(" ")
        );

        date = new Date(moment(new Date(date)).format("MM-DD-YYYY"));

        let asicModel = minerData.match(
          /(?=Whatsminer M\s*).*?(?=\s*for)/gs
        )![0];
        let asicSearchName = minerData
          .match(/(?=Whatsminer M\s*).*?(?=\s*T)/gs)![0]
          .split(" ")
          .slice(0, -1)
          .join(" ");

        let th = Number(
          asicModel
            .split(" ")
            .filter((e) =>
              e.includes("T") && Number.isInteger(Number(e[0])) ? e[0] : null
            )[0]
            .replace("T", "")
        );

        const asicName = asicModel.match(/(?=Whatsminer M\s*).*?(?=\s*T)/gs);

        let watts =
          asicWattList[asicSearchName][th] !== undefined
            ? asicWattList[asicSearchName][th]
            : asicWattList[asicSearchName]["wt"] * Number(th);

        let efficiency = watts / th;
        let model = `${asicName![0]}T`;
        let id = vendor + model + price + date;

        asics.push({
          vendor,
          model,
          th,
          watts,
          efficiency,
          price,
          date,
          id: sha1(id),
        });
      }

      if (
        minerData.includes("Canaan A") &&
        individualSales != null &&
        moqTest![0] === 1
      ) {
        let vendor = "Kaboomracks";
        let price = Number(
          minerData.match(/(?<=[$]\s*).*?(?=\s*each —)/gs)![0]
        );
        let date = moment(
          new Date(
            minerData
              .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)![0]
              .replace(/[^\x20-\x7E]/g, "")
              .split(" ")
              .map((day) => (day.includes(",") ? day.slice(0, -3) : day))
              .join(" ")
          )
        ).isValid()
          ? new Date(
              moment(
                new Date(
                  minerData
                    .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)![0]
                    .replace(/[^\x20-\x7E]/g, "")
                    .split(" ")
                    .map((day) => (day.includes(",") ? day.slice(0, -3) : day))
                    .join(" ")
                )
              ).format("MM-DD-YYYY")
            )
          : new Date(
              moment(
                new Date(
                  minerData
                    .match(/(?<=usa\s+).*?(?=\s+Miners for)/gs)![0]
                    .replace(/[^\x20-\x7E]/g, "")
                    .replace("| ", "")
                    .split(" ")
                    .map((day) => (day.includes(",") ? day.slice(0, -3) : day))
                    .join(" ")
                )
              ).format("MM-DD-YYYY")
            );

        let asicModel = minerData?.match(/(?=Canaan A\s*).*?(?=\s*for)/gs)![0];
        let asicSearchName = minerData
          .match(/(?=Canaan A\s*).*?(?=\s*T)/gs)![0]
          .split(" ")
          .slice(0, -1)
          .join(" ");

        if (asicModel.includes("T")) {
          let th = Number(
            asicModel
              .split(" ")
              .filter((e) =>
                e.includes("T") && Number.isInteger(Number(e[0])) ? e[0] : null
              )[0]
              .replace("T", "")
          );

          const asicName = asicModel?.match(/(?=Canaan A\s*).*?(?=\s*T)/gs);

          let watts =
            asicWattList[asicSearchName][th] !== undefined
              ? asicWattList[asicSearchName][th]
              : asicWattList[asicSearchName]["wt"] * Number(th);

          let efficiency = watts / th;
          let model = `${asicName![0]}T`;
          let id = vendor + model + price + date;

          asics.push({
            vendor,
            model,
            th,
            watts,
            efficiency,
            price,
            date,
            id: sha1(id),
          });
        } else if (!asicModel.includes("T")) {
          let th = Number(
            minerData?.match(/(?=[ㄴ]\s*).*?(?=\s*Th\/s)/gs)![0]?.split(" ")[1]
          );
          const asicName = minerData?.match(
            /(?=Canaan A\s*).*?(?=\s*for)/gs
          )![0];

          let watts =
            asicWattList[asicName][th] !== undefined
              ? asicWattList[asicName][th]
              : asicWattList[asicName]["wt"] * Number(th);

          let efficiency = watts / th;
          let model = asicName;
          let id = vendor + model + price + date;

          asics.push({
            vendor,
            model,
            th,
            watts,
            efficiency,
            price,
            date,
            id: sha1(id),
          });
        }
      }
    });

    //filters for dups
    const ids = asics.map((a) => a.id);
    const filtered = asics.filter(({ id }, idx) => !ids.includes(id, idx + 1));
    return filtered;
  } catch (err) {
    console.error(err);
  }
};

export default kaboomracksScraper;
