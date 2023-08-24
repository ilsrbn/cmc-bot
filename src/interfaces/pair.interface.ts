import { Subscription } from "./subscription.interface";

export type Pair = {
  id: number;
  name: string;
  pair: string;
  link: string;
  subscrtiptions: Array<Subscription>;
};
