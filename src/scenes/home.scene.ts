import { Scene, SceneEnter, Action } from "nestjs-telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import {
  HOME_SCENE_ID,
  ALL_SUBSCRIPTIONS_SCENE_ID,
  MY_LISTINGS_ID,
  CREATE_SUBSCRIPTION_SCENE_ID,
} from "@/app.constants";
import { Context } from "@context";

@Scene(HOME_SCENE_ID)
export class HomeScene {
  private buttons: Array<InlineKeyboardButton> = [
    MY_LISTINGS_ID,
    ALL_SUBSCRIPTIONS_SCENE_ID,
    CREATE_SUBSCRIPTION_SCENE_ID,
  ].map((button) => ({ text: button, callback_data: button }));

  private greetingText = `<b>${HOME_SCENE_ID}</b>\n\nWhere will we go?`;

  @SceneEnter()
  async onEnter(ctx: Context) {
    await ctx.replyWithHTML(this.greetingText, {
      reply_markup: {
        inline_keyboard: [this.buttons],
      },
    });
  }

  @Action(ALL_SUBSCRIPTIONS_SCENE_ID)
  async onLook(ctx: Context) {
    await ctx.scene.enter(ALL_SUBSCRIPTIONS_SCENE_ID);
  }

  @Action(CREATE_SUBSCRIPTION_SCENE_ID)
  async onCreate(ctx: Context) {
    await ctx.scene.enter(CREATE_SUBSCRIPTION_SCENE_ID);
  }

  @Action(MY_LISTINGS_ID)
  async onListings(ctx: Context) {
    await ctx.scene.enter(MY_LISTINGS_ID);
  }
}
