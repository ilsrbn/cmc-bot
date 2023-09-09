import { Insertable, Selectable, Updateable, Generated } from "kysely";

export interface ListingTable {
  id: Generated<number>;
  url: string;
  title: string;
  liquidity: number;
  holders: number;
  price: number;
}

export type Listing = Selectable<ListingTable>;
export type NewListing = Insertable<ListingTable>;
export type UpdatedListing = Updateable<ListingTable>;
