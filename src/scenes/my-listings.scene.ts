import { Scene, SceneEnter, Action } from "nestjs-telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import {
  HOME_SCENE_ID,
  MY_LISTINGS_ID,
  CREATE_LISTING_ID,
  VIEW_LISTING_ID,
} from "@/app.constants";
import { Context } from "@context";
import { FavouriteService, SubscriptionService } from "@services";

import { Pair } from "@/interfaces/pair.interface";
import { Listing } from "@/models/listing.model";

@Scene(MY_LISTINGS_ID)
export class MyListingsScene {
  constructor(
    private readonly subcriptionService: SubscriptionService,
    private favouriteService: FavouriteService
  ) {}
  private greetingText(pairs: Array<Listing>): string {
    if (!pairs.length)
      return `<b>There is no listings yet</b>\n\n<i>You can create first one with <b>"${CREATE_LISTING_ID}"</b> Button</i>`;
    let text = "<b>All your listings:</b>\n\n";
    text += pairs
      .map(
        (pair, i) =>
          `${i + 1}. ${pair.title} - <i>Current price: $${pair.price}</i>`
      )
      .join("\n");
    return text;
  }

  private baseButtons(): Array<InlineKeyboardButton> {
    return [CREATE_LISTING_ID, HOME_SCENE_ID].map((button) => ({
      text: button,
      callback_data: button,
    }));
  }

  private buttons(favourites: Listing[]): InlineKeyboardButton[][] {
    if (!favourites.length) return [this.baseButtons()];
    return [
      favourites.map((pair) => ({
        text: pair.title,
        callback_data: pair.id.toString(),
      })),
      this.baseButtons(),
    ];
  }

  @SceneEnter()
  async onEnter(ctx: Context) {
    const userId = ctx.from.id;

    const favourites = await this.favouriteService.getUsersFavourites(userId);

    await ctx.replyWithHTML(this.greetingText(favourites), {
      reply_markup: {
        inline_keyboard: this.buttons(favourites),
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

  @Action(/[0-9]+/)
  async onView(ctx: Context) {
    const [id] = ctx.match;
    return await ctx.scene.enter(VIEW_LISTING_ID, { id });
  }
}
