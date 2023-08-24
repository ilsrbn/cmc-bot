import { Insertable, Selectable, Updateable, Generated } from "kysely";

export interface IndicatorTable {
  id: Generated<number>;
  type: "total_liquidity" | "holders" | "price";
  target: number;
  initial: number;
  subscription_id: number;
}

export type Indicator = Selectable<IndicatorTable>;
export type NewIndicator = Insertable<IndicatorTable>;
export type UpdatedIndicator = Updateable<IndicatorTable>;
