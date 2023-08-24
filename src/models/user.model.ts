import { Insertable, Selectable, Updateable } from "kysely";

export interface UserTable {
  tg_id: number;
  scene_id: number;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UpdatedUser = Updateable<UserTable>;
