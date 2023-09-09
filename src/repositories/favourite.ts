import { Injectable } from "@nestjs/common";

import { db } from "@/models";
import { NewFavourite } from "@/models/favourite.model";

@Injectable()
export class FavouriteRepository {
  async getAll() {
    return await db.selectFrom("favourite").selectAll().execute();
  }

  async getListing(user_id: number, listing_id: number) {
    return await db
      .selectFrom("favourite")
      .where("listing_id", "=", listing_id)
      .where("user_id", "=", user_id)
      .selectAll()
      .executeTakeFirstOrThrow();
  }

  async getByUserId(user_id: number) {
    return await db
      .selectFrom("favourite")
      .innerJoin("listing", "listing.id", "listing_id")
      .selectAll()
      .where("user_id", "=", user_id)
      .execute();
  }

  async create(favourite: NewFavourite) {
    return await db
      .insertInto("favourite")
      .values(favourite)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async delete(user_id: number, listing_id: number) {
    return await db
      .deleteFrom("favourite")
      .where("listing_id", "=", listing_id)
      .where("user_id", "=", user_id)
      .execute();
  }
}
