import * as SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

import { UserTable } from "./user.model";
import { IndicatorTable } from "./indicator.model";
import { ListingTable } from "./listing.model";
import { SubscriptionTable } from "./subscription.model";

interface Database {
  user: UserTable;
  indicator: IndicatorTable;
  listing: ListingTable;
  subscription: SubscriptionTable;
}

const dialect = new SqliteDialect({
  database: new SQLite("db.sqlite"),
});

export const db = new Kysely<Database>({
  dialect,
});