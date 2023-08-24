import axios from "axios";
import Cheerio, { CheerioAPI } from "cheerio";

import { Injectable } from "@nestjs/common";

@Injectable()
export class ListingService {
  static listingTypes = {
    currency: "currency",
    dexscan: "dexscan",
  };
  private _listingType = ListingService.listingTypes.currency;

  private $: CheerioAPI;

  private set listingType(url: string) {
    const splitted = url.split("/");

    if (splitted.some((el) => el === ListingService.listingTypes.dexscan))
      this._listingType = ListingService.listingTypes.dexscan;

    if (splitted.some((el) => el === ListingService.listingTypes.currency))
      this._listingType = ListingService.listingTypes.currency;
  }

  private get listingType() {
    return this._listingType;
  }

  async getListing(url: string) {
    const { data } = await this.loadPage(url);
    if (!data) throw new Error("Invalid URL");

    this.listingType = url;

    this.$ = this.setupCheerio(data);
    const title = this.parseListingTitle();
    return title;
  }

  private async loadPage(url: string) {
    try {
      return await axios.get(url);
    } catch (e) {
      console.warn(e);
    }
  }

  private setupCheerio(data: any) {
    return Cheerio.load(data);
  }

  private parseListingTitle() {
    try {
      const selectors = {
        [ListingService.listingTypes.currency]:
          '#section-coin-overview [data-role="coin-info"] [data-role="coin-name"]',
        [ListingService.listingTypes.dexscan]: ".dex-pairs-name-text",
      };
      const selector = selectors[this.listingType];

      if (this.listingType === ListingService.listingTypes.currency)
        return this.getCurrencyTitle(selector);
      else return this.getDexScanTitle(selector);
    } catch (e) {
      console.warn(e);
      return "NOT FOUND";
    }
  }

  private getDexScanTitle(selector: string) {
    const content = this.$(selector).contents();
    return content.text();
  }

  private getCurrencyTitle(selector: string) {
    const contentArray = this.$(selector).contents().toArray();
    console.log(contentArray);

    const text = (
      contentArray.find((el) => el.type === "text") as { data: string }
    ).data;

    console.log({ text });

    return text;
  }
}
