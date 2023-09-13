import { Scene, SceneEnter, Action } from "nestjs-telegraf";

import { SubscriptionService } from "@services";

import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { Context } from "@context";

import {
  HOME_SCENE_ID,
  ALL_SUBSCRIPTIONS_SCENE_ID,
  CREATE_SUBSCRIPTION_SCENE_ID,
  VIEW_SUBSCRIPTION_ID,
} from "@/app.constants";
import { SubscriptionWithListing } from "@/models/subscription.model";

@Scene(ALL_SUBSCRIPTIONS_SCENE_ID)
export class AllSubscriptionsScene {
  constructor(private readonly subcriptionService: SubscriptionService) { }
  private greetingText(pairs: Array<SubscriptionWithListing>): string {
    if (!pairs.length)
      return `<b>There is no subscriptions yet</b>\n\n<i>You can create first one with <b>"${CREATE_SUBSCRIPTION_SCENE_ID}"</b> Button</i>`;
    let text = "<b>All your active subscriptions:</b>\n\n";
    text += pairs
      .map(
        (pair, i) =>
          `${i + 1}.` +
          ` ${pair.title}` +
          `- <i>${pair.type} to be:` +
          ` ${pair.type === "price" ? "$" : ""}${pair.target}</i>`
      )
      .join("\n");
    return text;
  }

  private baseButtons(): Array<InlineKeyboardButton> {
    return [CREATE_SUBSCRIPTION_SCENE_ID, HOME_SCENE_ID].map((button) => ({
      text: button,
      callback_data: button,
    }));
  }

  private buttons(
    pairs: Array<SubscriptionWithListing>
  ): InlineKeyboardButton[][] {
    if (!pairs.length) return [this.baseButtons()];
    const subscriptions: InlineKeyboardButton[][] = pairs.map((pair, i) => [
      {
        text: "✏️" + " " + (i + 1) + ". " + pair.title + " - " + pair.type,
        callback_data: pair.id.toString(),
      },
    ]);
    subscriptions.push(this.baseButtons());
    return subscriptions;
  }

  @SceneEnter()
  async onEnter(ctx: Context) {
    const userId = ctx.from.id;

    const subs = await this.subcriptionService.getAllSubscription(userId);
    await ctx.replyWithHTML(this.greetingText(subs), {
      reply_markup: {
        inline_keyboard: this.buttons(subs),
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

  @Action(/[0-9]+/)
  async onView(ctx: Context) {
    const [id] = ctx.match;
    return await ctx.scene.enter(VIEW_SUBSCRIPTION_ID, { id });
  }
}
