import axios from "axios";
import { CheerioAPI, load as CheerioLoad } from "cheerio";

import { NewListing } from "@/models/listing.model";

export abstract class AbstractParser {
  // Template method
  public async mine(url: string): Promise<NewListing> | null {
    const page = await this.loadPage(url);
    if (!page || !page.data) return null;

    const $ = CheerioLoad(page.data);
    this.afterPageLoad($);

    const title = await this.getTitle($);
    const price = await this.getPrice($);
    const holders = await this.getHolders($);
    const liquidity = await this.getLiquidity($);

    return {
      url,
      title,
      price,
      holders,
      liquidity,
    };
  }

  // Implementation agnostic methods
  protected async loadPage(url: string) {
    try {
      return await axios.get(url);
    } catch (e) {
      return null;
    }
  }

  // Methods to be implemented in subclasses
  protected abstract getTitle($: CheerioAPI): string;
  protected abstract getHolders($: CheerioAPI): number | null;
  protected abstract getPrice($: CheerioAPI): number | null;
  protected abstract getLiquidity($: CheerioAPI): number | null;

  // Can be optioanaly implemented in subclasses
  protected afterPageLoad($: CheerioAPI) {}
}
