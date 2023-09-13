import { Injectable } from "@nestjs/common";

import { db } from "@/models";
import { NewSubscription } from "@/models/subscription.model";

@Injectable()
export class SubscriptionRepository {
  async deleteById(id: number) {
    return await db.deleteFrom("subscription").where("id", "=", id).execute();
  }
  async createSubscription(subscription: NewSubscription) {
    return await db
      .insertInto("subscription")
      .values(subscription)
      .executeTakeFirstOrThrow();
  }

  async getUserSubscriptions(userId: number) {
    return await db
      .selectFrom("subscription")
      .where("user_id", "=", userId)
      .leftJoin("listing", "listing.id", "subscription.listing_id")
      .select([
        "subscription.id as id",
        "listing_id as listing_id",
        "user_id",
        "type",
        "initial",
        "target",
        "listing.url",
        "listing.title",
        "listing.liquidity",
        "listing.holders",
        "listing.price",
      ])
      .execute();
  }

  async getAllSubscrtiptions() {
    return await db
      .selectFrom("subscription")
      .leftJoin("listing", "listing.id", "subscription.listing_id")
      .select([
        "subscription.id as id",
        "listing_id as listing_id",
        "user_id",
        "type",
        "initial",
        "target",
        "listing.url",
        "listing.title",
        "listing.liquidity",
        "listing.holders",
        "listing.price",
      ])
      .execute();
  }

  async getSubscriptionById(id: number) {
    return await db
      .selectFrom("subscription")
      .where("subscription.id", "=", id)
      .leftJoin("listing", "listing.id", "subscription.listing_id")
      .select([
        "subscription.id as id",
        "listing_id as listing_id",
        "user_id",
        "type",
        "initial",
        "target",
        "listing.url",
        "listing.title",
        "listing.liquidity",
        "listing.holders",
        "listing.price",
      ])
      .executeTakeFirstOrThrow();
  }
}
