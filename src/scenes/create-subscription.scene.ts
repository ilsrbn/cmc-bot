import { Scene, SceneEnter, Action } from "nestjs-telegraf";

import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { Context } from "@context";

import {
  HOME_SCENE_ID,
  CREATE_SUBSCRIPTION_SCENE_ID,
  ALL_SUBSCRIPTIONS_SCENE_ID,
} from "@/app.constants";
import { FavouriteService } from "@/services";
import { Listing } from "@/models/listing.model";

type SceneState = {
  listing_id: number;
};

@Scene(CREATE_SUBSCRIPTION_SCENE_ID)
export class CreateSubscriptionScene {
  private favourites: Listing[];
  private formatter = new Intl.ListFormat("en", {
    style: "long",
    type: "disjunction",
  });

  constructor(private favouriteService: FavouriteService) { }

  private get greetingText(): string {
    return "Please, select listing from your Favourites you want to keep track of";
  }

  @SceneEnter()
  async onEnter(ctx: Context) {
    this.favourites = await this.favouriteService.getUsersFavourites(
      ctx.from.id
    );
    await ctx.replyWithHTML(this.greetingText, {
      reply_markup: {
        inline_keyboard: this.buttons,
      },
    });
  }

  @Action(HOME_SCENE_ID)
  async onLook(ctx: Context) {
    await ctx.scene.enter(HOME_SCENE_ID);
  }

  private get buttons(): InlineKeyboardButton[][] {
    const pairs = this.favourites;
    return [
      pairs.map((pair) => ({
        text: pair.title,
        callback_data: pair.id.toString(),
      })),
      [ALL_SUBSCRIPTIONS_SCENE_ID, HOME_SCENE_ID].map((button) => ({
        text: button,
        callback_data: button,
      })),
    ];
  }

  @Action(/[0-9]+/)
  async onSelectedPair(ctx: Context) {
    const [listing_id] = ctx.match;
    (ctx.scene.state as SceneState).listing_id = listing_id;
    ctx.scene.state;
    const listingIdx = this.favourites.findIndex((el) => el.id === +listing_id);
    const found = this.favourites[listingIdx] || null;
    if (found)
      await ctx.replyWithHTML(this.makeListingMesssage(found), {
        reply_markup: {
          inline_keyboard: [this.makeSubscriptionButtons(found)],
        },
      });
  }

  private makeListingMesssage(listing: Listing) {
    const availableSubscriptionIndicators = ["price"];
    if (listing.holders) availableSubscriptionIndicators.push("holders");
    if (listing.liquidity) availableSubscriptionIndicators.push("liquidity");
    return (
      "Selected listing is:\n\n" +
      `<b>${listing.title}</b>` +
      "\n\n" +
      `\tPrice: <b>$${listing.price}</b>` +
      "\n" +
      `\tHolders: <b>${listing.holders || "-"}</b>` +
      "\n" +
      `\tTotal Liquidity: <b>${listing.liquidity || "-"}</b>` +
      `\n\n You can subscribe on the: ${this.formatter.format(
        availableSubscriptionIndicators
      )}.`
    );
  }
  private makeSubscriptionButtons(listing: Listing) {
    const availableSubscriptionIndicators = ["price"];
    if (listing.holders) availableSubscriptionIndicators.push("holders");
    if (listing.liquidity) availableSubscriptionIndicators.push("liquidity");

    return availableSubscriptionIndicators.map((el) => ({
      text: `Select ${el}`,
      callback_data: el,
    }));
  }

  // TODO: handle selection of Indicator type
  @Action(["price", "holders", "liquidity"])
  async onSelectType(ctx: Context) { }
}
