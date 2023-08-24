import { Injectable } from "@nestjs/common";

import { db } from "@/models";
import { NewListing } from "@/models/listing.model";

@Injectable()
export class ListingRepository {
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
}
