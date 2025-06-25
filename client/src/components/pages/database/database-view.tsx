import "./database-view.module.css";
import BreakdownChart from "./breakdown-chart";
import { useState, useEffect } from "react";
import getNumOfLicenses, {
  BusinessLicense,
  BostonZipCode,
} from "@/services/data-interface/data-interface";
import licensesJSON from "../../../data/licenses.json";

type DataInfo = {
  zipCode: BostonZipCode | undefined;
  transferableLicenses: number;
  nonTransferableLicenses: number;
  allAlcoholLicenses: number;
  wineAndBeerLicenses: number;
};

const DatabaseView = () => {
  const [counts, setCounts] = useState<DataInfo>({
    zipCode: undefined,
    transferableLicenses: 0,
    nonTransferableLicenses: 195,
    allAlcoholLicenses: 117,
    wineAndBeerLicenses: 78,
  });

  useEffect(() => {
    const data = licensesJSON as BusinessLicense[];
    setCounts({
      ...counts,
      nonTransferableLicenses: getNumOfLicenses(data),
      allAlcoholLicenses: getNumOfLicenses(data, {
        filterByAlcoholType: "All Alcoholic Beverages",
      }),
      wineAndBeerLicenses: getNumOfLicenses(data, {
        filterByAlcoholType: "Wines and Malt Beverages",
      }),
    });
  }, []);

  const onZipFilterChange = (filter: string): void => {
    const data = licensesJSON as BusinessLicense[];
    const zip = filter as BostonZipCode;
    const total = getNumOfLicenses(data, { filterByZipcode: zip });
    const allAlc = getNumOfLicenses(data, {
      filterByZipcode: zip,
      filterByAlcoholType: "All Alcoholic Beverages",
    });
    const beerAndWine = getNumOfLicenses(data, {
      filterByZipcode: zip,
      filterByAlcoholType: "Wines and Malt Beverages",
    });

    setCounts({
      ...counts,
      zipCode: zip,
      nonTransferableLicenses: total,
      allAlcoholLicenses: allAlc,
      wineAndBeerLicenses: beerAndWine,
    });
  };

  // const onLicenseTypeFilterChange = (filter: string): void => {
  //   const data = licensesJSON as BusinessLicense[];
  //   const type = filter;

  //   const licenses = getNumOfLicenses(data, { filterByAlcoholType: type });

  //   setCounts({ ...counts });
  // };

  return (
    <section className="database-view">
      <h1>Database View</h1>
      <p>This is where the database content will be displayed.</p>
      <button
        onClick={() => onZipFilterChange("02128")}
        style={{ backgroundColor: "grey" }}
      >
        filter zip
      </button>

      {/* PLACEHOLDER */}
      <BreakdownChart
        transferableLicenses={counts.transferableLicenses}
        nonTransferableLicenses={counts.nonTransferableLicenses}
        allAlcoholLicenses={counts.allAlcoholLicenses}
        wineAndBeerLicenses={counts.wineAndBeerLicenses}
      />
    </section>
  );
};

export default DatabaseView;
