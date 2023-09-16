import { Injectable } from "@nestjs/common";

import { db } from "@/models";
import { NewUser } from "@/models/user.model";

@Injectable()
export class UserRepository {
  async getUserById(id: number) {
    return await db
      .selectFrom("user")
      .where("tg_id", "=", id)
      .selectAll()
      .executeTakeFirst();
  }

  async createUser(user: NewUser) {
    return await db.insertInto("user").values(user).returningAll().execute();
  }

  async getAllUsers() {
    return await db.selectFrom("user").selectAll().execute();
  }
}
