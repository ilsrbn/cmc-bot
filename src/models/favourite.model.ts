import { Insertable, Selectable, Updateable } from "kysely";

export interface FavouriteTable {
  listing_id: number;
  user_id: number;
}

export type Favourite = Selectable<FavouriteTable>;
export type NewFavourite = Insertable<FavouriteTable>;
export type UpdatedFavourite = Updateable<FavouriteTable>;
