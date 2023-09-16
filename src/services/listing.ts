import { Injectable, Logger } from "@nestjs/common";

import { Listing, UpdatedListing } from "@models/listing.model";
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

  private readonly logger = new Logger(ListingService.name);

  constructor(
    private listingRepo: ListingRepository,
    private parserService: ParserService,
    private favouriteService: FavouriteService,

    private urlUtils: UrlUtils
  ) { }

  async getListingById(id: number) {
    return await this.listingRepo.getListingById(id);
  }

  async getListing(url: string, userId = -1, forceParse = false) {
    const listingType = this.getListingType(url);
    if (!listingType)
      throw new Error(
        'The provided URL is not supported type of listing ("dexscan" or "currency")'
      );

    url = this.urlUtils.toEnglish(url);

    const listing: Listing = await this.getExistingListing(url);
    if (!forceParse && listing) {
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

  async requestUpdate(id: number) {
    const oldListing = await this.listingRepo.getListingById(id);
    const parsedListing = await this.getListing(oldListing.url, -1, true);
    const payload = {
      id,
      price: parsedListing.price,
      holders: parsedListing.holders,
      liquidity: parsedListing.liquidity,
      title: parsedListing.title,
    };
    this.logger.debug(``);
    this.logger.debug(`REQUESTED UPDATE OF LISTING WITH ID "${payload.id}"`);
    await this.updateListing(payload);
    this.logger.verbose(`UPDATED!`);
  }

  async updateListing(listing: UpdatedListing) {
    return await this.listingRepo.updateListing(listing);
  }

  async getAllListings() {
    return await this.listingRepo.getAllListings();
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
