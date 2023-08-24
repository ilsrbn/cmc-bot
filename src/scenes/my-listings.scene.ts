import { Scene, SceneEnter, Action } from "nestjs-telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import {
  HOME_SCENE_ID,
  MY_LISTINGS_ID,
  CREATE_LISTING_ID,
} from "@/app.constants";
import { Context } from "@context";
import { SubscriptionService } from "@services";

import { Pair } from "@/interfaces/pair.interface";

@Scene(MY_LISTINGS_ID)
export class MyListingsScene {
  constructor(private readonly subcriptionService: SubscriptionService) { }
  private greetingText(pairs: Array<Pair>): string {
    if (!pairs.length)
      return `<b>There is no listings yet</b>\n\n<i>You can create first one with <b>"${CREATE_LISTING_ID}"</b> Button</i>`;
    let text = "<b>All your listings:</b>\n\n";
    text += pairs
      .map((pair, i) => `${i + 1}. ${pair.pair} - <i>${pair.name}</i>`)
      .join("\n");
    return text;
  }

  private baseButtons(): Array<InlineKeyboardButton> {
    return [CREATE_LISTING_ID, HOME_SCENE_ID].map((button) => ({
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

  @Action(CREATE_LISTING_ID)
  async onCreate(ctx: Context) {
    await ctx.scene.enter(CREATE_LISTING_ID);
  }
}
