import { session } from "telegraf";
import { SQLite } from "@telegraf/session/sqlite";

const store = SQLite({
  filename: "./telegraf-sessions.sqlite",
});

// Use "store as any" as workaround
export const sessionMiddleware = session({
  store: store as any,
  getSessionKey: async (ctx) => (await ctx.from?.id?.toString()) || "-1",
});
