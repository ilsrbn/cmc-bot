import { Injectable } from "@nestjs/common";
import { CheerioAPI } from "cheerio";
import { AbstractParser } from "./abstract";

@Injectable()
export class DexScanParser extends AbstractParser {
  protected getTitle($: CheerioAPI): string {
    const first = $(
      ".dex-pairs-name-text > .base-token > span:first-child"
    ).text();
    const last = $(".dex-pairs-name-text > .quote-token > a").text();
    return `${first} / ${last}`;
  }

  protected getPrice($: CheerioAPI): number {
    return parseFloat(
      $(".dex-price > div:nth-child(2) > span > span")
        .text()
        .replace("$", "")
        .replace(",", "")
    );
  }

  protected getLiquidity($: CheerioAPI): number {
    return parseFloat(
      $(".box-number").first().text().replace("$", "").replace(",", "")
    );
  }

  protected getHolders($: CheerioAPI): number {
    return parseFloat(
      $(".box-number").last().text().replace("$", "").replace(",", "")
    );
  }
}
