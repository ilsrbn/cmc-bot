import { CheerioAPI } from "cheerio";

import { Injectable } from "@nestjs/common";

import { AbstractParser } from "./abstract";

@Injectable()
export class CurrencyParser extends AbstractParser {
  protected getTitle($: CheerioAPI): string {
    return $(".coin-name-pc").text();
  }

  protected getPrice($: CheerioAPI): number {
    return parseFloat(
      $(".coin-stats-header > div:last-child > span:first-child")
        .text()
        .replace("$", "")
        .replace(",", "")
    );
  }

  protected getLiquidity(_$: CheerioAPI): number {
    return null;
  }

  protected getHolders(_$: CheerioAPI): number {
    return null;
  }
}
