import { Action, Scene, SceneEnter } from "nestjs-telegraf";

import {
  ALL_SUBSCRIPTIONS_SCENE_ID,
  VIEW_SUBSCRIPTION_ID,
} from "@/app.constants";
import { Context } from "@/interfaces/context.interface";
import { SubscriptionWithListing } from "@/models/subscription.model";
import { SubscriptionService } from "@/services";

type SceneState = {
  id: number;
  deletion: boolean;
};

@Scene(VIEW_SUBSCRIPTION_ID)
export class ViewSubscriotionbScene {
  constructor(private subscriptionService: SubscriptionService) { }

  @SceneEnter()
  async onEnter(ctx: Context) {
    const state = ctx.scene.state as SceneState;

    const subscription = await this.subscriptionService.getSubscriptionById(
      state.id
    );
    await ctx.replyWithHTML(this.makeSubscriptionMesssage(subscription), {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🗑 Delete", callback_data: "YES" },
            { text: "🔙 Go Back", callback_data: ALL_SUBSCRIPTIONS_SCENE_ID },
          ],
        ],
      },
    });
  }

  @Action("YES")
  async onDelete(ctx: Context) {
    (ctx.scene.state as SceneState).deletion = true;
    await ctx.replyWithHTML(
      "Are you sure you want to delete the subscription?",
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🗑 Yes, delete subscription.", callback_data: "CONFIRM" },
              {
                text: "🔙 No, I don't want to delete it.",
                callback_data: "CANCEL",
              },
            ],
          ],
        },
      }
    );
  }

  @Action("CANCEL")
  async onCancel(ctx: Context) {
    return await this.onEnter(ctx);
  }

  @Action("CONFIRM")
  async onConfirm(ctx: Context) {
    const isDeletion = (ctx.scene.state as SceneState).deletion;
    if (!isDeletion) return false;
    const subscriptionId = (ctx.scene.state as SceneState).id;
    await this.subscriptionService.delete(subscriptionId);
    return await this.onGoBack(ctx);
  }

  @Action(ALL_SUBSCRIPTIONS_SCENE_ID)
  async onGoBack(ctx: Context) {
    (ctx.scene.state as SceneState).id = null;
    (ctx.scene.state as SceneState).deletion = false;
    return await ctx.scene.enter(ALL_SUBSCRIPTIONS_SCENE_ID);
  }

  private makeSubscriptionMesssage(subscription: SubscriptionWithListing) {
    return (
      `<b>${subscription.title}</b>` +
      "\n\n" +
      `\tPrice: <b>$${subscription.price}</b>` +
      "\n" +
      `\tHolders: <b>${subscription.holders || "-"}</b>` +
      "\n" +
      `\tTotal Liquidity: <b>${subscription.liquidity || "-"}</b>` +
      `\n\n` +
      `Subscribed on: <b>${subscription.type}</b>` +
      `\n` +
      `Targeted value: <b>${subscription.type === "price" ? "$" : ""}${subscription.target
      }</b>`
    );
  }
}
