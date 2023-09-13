import * as SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

import { UserTable } from "./user.model";
import { ListingTable } from "./listing.model";
import { SubscriptionTable } from "./subscription.model";
import { FavouriteTable } from "./favourite.model";

interface Database {
  user: UserTable;
  listing: ListingTable;
  subscription: SubscriptionTable;
  favourite: FavouriteTable;
}

const dialect = new SqliteDialect({
  database: new SQLite("db.sqlite"),
});

export const db = new Kysely<Database>({
  dialect,
});
