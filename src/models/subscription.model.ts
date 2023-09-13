import { Insertable, Selectable, Updateable, Generated } from "kysely";

export interface SubscriptionTable {
  id: Generated<number>;
  user_id: number;
  listing_id: number;
  initial: number;
  target: number;
  type: string;
}

export interface SubscriptionWithListing {
  id: number;
  user_id: number;
  listing_id: number;
  initial: number;
  target: number;
  type: string;
  url: string;
  title: string;
  liquidity: number | null;
  holders: number | null;
  price: number;
}

export type Subscription = Selectable<SubscriptionTable>;
export type NewSubscription = Insertable<SubscriptionTable>;
export type UpdatedSubscription = Updateable<SubscriptionTable>;
