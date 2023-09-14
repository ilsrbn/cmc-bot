import { Injectable } from "@nestjs/common";
import { CheerioAPI } from "cheerio";
import { AbstractParser } from "./abstract";

@Injectable()
export class DexScanParser extends AbstractParser {
  protected getTitle($: CheerioAPI): string {
    const title = $("head title").text().split(" ")[0];

    const [first, last] = title.split("/");

    return `${first} / ${last}`;
  }

  protected getPrice($: CheerioAPI): number {
    return parseFloat(
      $(".dex-price > div:nth-child(2) > span > span")
        .text()
        .replace("$", "")
        .replace(/,/g, "")
    );
  }

  protected getLiquidity($: CheerioAPI): number {
    return parseFloat(
      $(".box-number").first().text().replace("$", "").replace(/,/g, "")
    );
  }

  protected getHolders($: CheerioAPI): number {
    return parseFloat(
      $(".box-number").last().text().replace("$", "").replace(/,/g, "")
    );
  }
}
