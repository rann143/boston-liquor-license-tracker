import "./database-view.module.css";
import BreakdownChart from "./breakdown-chart";
import { useState, useEffect } from "react";
import getNumOfLicenses, {
  BusinessLicense,
  BostonZipCode,
} from "@/services/data-interface/data-interface";
import licensesJSON from "../../../data/licenses.json";
import {
  getAvailableLicensesByZipcode,
  getZipcodesWithAvailableLicenses,
} from "@/services/data-interface/data-interface";

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

  function onZipFilterChange(filter: string) {
    const data = licensesJSON as BusinessLicense[];
    const zip = filter as BostonZipCode;
    const { totalAvailable, allAlcoholAvailable, beerWineAvailable } =
      getAvailableLicensesByZipcode(data, zip);

    setLicenseCounts({
      ...licenseCounts,
      zipCode: zip,
      nonTransferableLicenses: totalAvailable,
      allAlcoholLicenses: allAlcoholAvailable,
      wineAndBeerLicenses: beerWineAvailable,
    });
  }

  function onTypeChange(filter: string) {
    const data = licensesJSON as BusinessLicense[];
    const zips = getZipcodesWithAvailableLicenses(
      data,
      "All Alcoholic Beverages"
    );

    return zips;
  }

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

      <ul>
        {onTypeChange("All Alcoholic Beverages").map((item, index) => (
          <li key={index}>
            {item.zipcode}: Total={item.totalAvailable}, Alc=
            {item.allAlcoholAvailable}, BW={item.beerWineAvailable}
          </li>
        ))}
      </ul>

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
