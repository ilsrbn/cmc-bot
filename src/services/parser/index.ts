import { Injectable } from "@nestjs/common";

import { AbstractParser } from "./abstract";
import { CurrencyParser } from "./currency";
import { DexScanParser } from "./dexscan";

import type { ListingType } from "@/interfaces/listing.type";

@Injectable()
export class ParserService {
  constructor(
    private dexscanParser: DexScanParser,
    private currencyParser: CurrencyParser
  ) {}

  public getParser(listingType: ListingType): AbstractParser {
    switch (listingType) {
      case "dexscan":
        return this.dexscanParser;
      case "currency":
      default:
        return this.currencyParser;
    }
  }
}
