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
  const [licenseCounts, setLicenseCounts] = useState<DataInfo>({
    zipCode: undefined,
    transferableLicenses: 0,
    nonTransferableLicenses: 195,
    allAlcoholLicenses: 117,
    wineAndBeerLicenses: 78,
  });

  useEffect(() => {
    const data = licensesJSON as BusinessLicense[];
    setLicenseCounts({
      ...licenseCounts,
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

    setLicenseCounts({
      ...licenseCounts,
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
        onClick={() => onZipFilterChange("02118")}
        style={{ backgroundColor: "grey" }}
      >
        filter zip
      </button>

      {/* PLACEHOLDER */}
      <BreakdownChart
        transferableLicenses={licenseCounts.transferableLicenses}
        nonTransferableLicenses={licenseCounts.nonTransferableLicenses}
        allAlcoholLicenses={licenseCounts.allAlcoholLicenses}
        wineAndBeerLicenses={licenseCounts.wineAndBeerLicenses}
      />
    </section>
  );
};

export default DatabaseView;
