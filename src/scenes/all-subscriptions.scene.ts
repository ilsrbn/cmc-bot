import { Scene, SceneEnter, Action } from "nestjs-telegraf";

import { SubscriptionService } from "@services";

import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { Context } from "@context";
import { Pair } from "@/interfaces/pair.interface";

import {
  HOME_SCENE_ID,
  ALL_SUBSCRIPTIONS_SCENE_ID,
  CREATE_SUBSCRIPTION_SCENE_ID,
} from "@/app.constants";

@Scene(ALL_SUBSCRIPTIONS_SCENE_ID)
export class AllSubscriptionsScene {
  constructor(private readonly subcriptionService: SubscriptionService) { }
  private greetingText(pairs: Array<Pair>): string {
    if (!pairs.length)
      return `<b>There is no subscriptions yet</b>\n\n<i>You can create first one with <b>"${CREATE_SUBSCRIPTION_SCENE_ID}"</b> Button</i>`;
    let text = "<b>All your active subscriptions:</b>\n\n";
    text += pairs
      .map((pair, i) => `${i + 1}. ${pair.pair} - <i>${pair.name}</i>`)
      .join("\n");
    return text;
  }

  private baseButtons(): Array<InlineKeyboardButton> {
    return [CREATE_SUBSCRIPTION_SCENE_ID, HOME_SCENE_ID].map((button) => ({
      text: button,
      callback_data: button,
    }));
  }

  private buttons(pairs: Array<Pair>): InlineKeyboardButton[][] {
    if (!pairs.length) return [this.baseButtons()];
    return [
      pairs.map((pair) => ({
        text: pair.name,
        callback_data: pair.id.toString(),
      })),
      this.baseButtons(),
    ];
  }

  @SceneEnter()
  async onEnter(ctx: Context) {
    const userId = ctx.from.id;

    const subs = await this.subcriptionService.getAllSubscription(userId);
    console.log({ subs });
    await ctx.replyWithHTML(this.greetingText([]), {
      reply_markup: {
        inline_keyboard: this.buttons([]),
      },
    });
  }

  @Action(HOME_SCENE_ID)
  async onHome(ctx: Context) {
    await ctx.scene.enter(HOME_SCENE_ID);
  }

  @Action(CREATE_SUBSCRIPTION_SCENE_ID)
  async onCreate(ctx: Context) {
    await ctx.scene.enter(CREATE_SUBSCRIPTION_SCENE_ID);
  }
}
