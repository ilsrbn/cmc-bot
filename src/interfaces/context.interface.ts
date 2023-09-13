import { Scenes } from "telegraf";

type Match = Array<any>;

export type Context = Scenes.SceneContext & { match: Match };
