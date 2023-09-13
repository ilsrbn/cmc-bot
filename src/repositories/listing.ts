import { Injectable } from "@nestjs/common";

import { db } from "@/models";
import { NewListing, UpdatedListing } from "@/models/listing.model";

@Injectable()
export class ListingRepository {
  async getListingByUrl(url: string) {
    return await db
      .selectFrom("listing")
      .where("url", "=", url)
      .selectAll()
      .executeTakeFirstOrThrow();
  }
  async getListingById(id: number) {
    return await db
      .selectFrom("listing")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirst();
  }

  async getAllListings() {
    return await db.selectFrom("listing").selectAll().execute();
  }

  async createListing(listing: NewListing) {
    return await db
      .insertInto("listing")
      .values(listing)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateListing(listing: UpdatedListing) {
    return await db
      .updateTable("listing")
      .set({
        price: listing.price,
        holders: listing.holders,
        liquidity: listing.liquidity,
        title: listing.title,
      })
      .where("id", "=", listing.id)
      .executeTakeFirstOrThrow();
  }
}
