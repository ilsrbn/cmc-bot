import { Injectable } from "@nestjs/common";

import { Listing } from "@models/listing.model";
import { ListingRepository } from "@repos";
import { UrlUtils } from "@/utils";

import { ListingType } from "@/interfaces/listing.type";
import { ParserService } from "./parser/index";
import { FavouriteService } from "./favourite";

@Injectable()
export class ListingService {
  static listingTypes = {
    currency: "currencies",
    dexscan: "dexscan",
  };

  constructor(
    private listingRepo: ListingRepository,
    private parserService: ParserService,
    private favouriteService: FavouriteService,

    private urlUtils: UrlUtils
  ) {}

  async getListing(url: string, userId: number) {
    const listingType = this.getListingType(url);
    if (!listingType)
      throw new Error(
        'The provided URL is not supported type of listing ("dexscan" or "currency")'
      );

    url = this.urlUtils.toEnglish(url);

    const listing: Listing = await this.getExistingListing(url);
    if (listing) {
      const inFavourite = await this.favouriteService.getFavourite(
        userId,
        listing.id
      );
      return {
        isNew: false,
        inFavourite,
        ...listing,
      };
    }
    const parser = this.parserService.getParser(listingType);

    const newListing = await parser.mine(url);

    return { isNew: true, ...newListing, inFavourite: false };
  }

  async addToFavourite(listing: Listing, isNew: boolean, userId: number) {
    if (isNew)
      listing = await this.listingRepo.createListing({
        url: listing.url,
        price: listing.price,
        title: listing.title,
        holders: listing.holders,
        liquidity: listing.liquidity,
      });
    return await this.favouriteService.addToFavourite(userId, listing.id);
  }

  private getListingType(url: string): ListingType {
    const splitted = url.split("/");

    if (splitted.some((el) => el === ListingService.listingTypes.dexscan))
      return "dexscan";

    if (splitted.some((el) => el === ListingService.listingTypes.currency))
      return "currency";

    return null;
  }

  private async getExistingListing(url: string) {
    try {
      const listing = await this.listingRepo.getListingByUrl(url);
      return listing;
    } catch (e) {
      return null;
    }
  }
}
