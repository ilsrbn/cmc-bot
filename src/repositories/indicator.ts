import { Injectable } from "@nestjs/common";

import { db } from "@/models";
import { NewIndicator } from "@/models/indicator.model";

@Injectable()
export class IndicatorRepository {
  async getById(id: number) {
    return await db
      .selectFrom("indicator")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirst();
  }

  async getAll() {
    return await db.selectFrom("indicator").selectAll().execute();
  }

  async create(indicator: NewIndicator) {
    return await db
      .insertInto("indicator")
      .values(indicator)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async delete(id: number) {
    return await db
      .deleteFrom("indicator")
      .where("indicator.id", "=", id)
      .execute();
  }
}
