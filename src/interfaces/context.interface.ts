import { Scenes } from "telegraf";
import { Pair } from "./pair.interface";
import { Subscription } from "./subscription.interface";

type Match = Array<any>;

export type Context = Scenes.SceneContext & { match: Match };
