import { Insertable, Selectable, Updateable, Generated } from "kysely";

export interface SubscriptionTable {
  id: Generated<number>;
  user_id: number;
  listing_id: number;
  indicator_id: number;
}

export type Subscription = Selectable<SubscriptionTable>;
export type NewSubscription = Insertable<SubscriptionTable>;
export type UpdatedSubscription = Updateable<SubscriptionTable>;
