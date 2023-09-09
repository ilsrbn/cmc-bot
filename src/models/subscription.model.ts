import { Insertable, Selectable, Updateable } from "kysely";

export interface SubscriptionTable {
  user_id: number;
  listing_id: number;
  indicator_id: number;
}

export type Subscription = Selectable<SubscriptionTable>;
export type NewSubscription = Insertable<SubscriptionTable>;
export type UpdatedSubscription = Updateable<SubscriptionTable>;
