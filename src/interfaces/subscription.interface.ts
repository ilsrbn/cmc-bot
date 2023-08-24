import { StatNameEnum } from "./stat-name.enum";

export type Subscription = {
  pairId: number;
  ownerId: number;
  id: number;
  name: string;
  statName: StatNameEnum;
  initialValue: number;
  targetValue: number;
  createdAt: number;
};
