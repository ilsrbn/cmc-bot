import { Injectable } from "@nestjs/common";

import { db } from "@/models";
import { NewSubscription } from "@/models/subscription.model";

@Injectable()
export class SubscriptionRepository {
  async createSubscription(subscription: NewSubscription) {
    return await db
      .insertInto("subscription")
      .values(subscription)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async getUserSubscriptions(userId: number) {
    return await db
      .selectFrom("subscription")
      .where("user_id", "=", userId)
      .leftJoin("listing", "listing.id", "subscription.listing_id")
      .leftJoin("indicator", "indicator.id", "subscription.indicator_id")
      .select([
        "listing_id",
        "indicator_id",
        "user_id",
        "listing.url",
        "listing.title",
        "listing.liquidity",
        "listing.holders",
        "listing.price",
        "indicator.type as indicator_type",
        "indicator.initial",
        "indicator.target",
      ])
      .execute();
  }
}
