import { Scene, SceneEnter, Action, Hears } from "nestjs-telegraf";

import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { Context } from "@context";

import { ListingService } from "@services";

import { MY_LISTINGS_ID, CREATE_LISTING_ID } from "@/app.constants";

@Scene(CREATE_LISTING_ID)
export class CreateListingScene {
  static URL_REGEX =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  private get greetingText(): string {
    return `<b>New Listing</b>\n\nProvide <b>link to pair/token</b> you want to keep track of.\n\n<i>Example: https://coinmarketcap.com/currencies/bitcoin/</i>\n\n`;
  }

  private get buttons(): Array<InlineKeyboardButton> {
    return [
      {
        text: "Back",
        callback_data: MY_LISTINGS_ID,
      },
    ];
  }

  constructor(private readonly listingService: ListingService) { }

  @SceneEnter()
  async onEnter(ctx: Context) {
    await ctx.replyWithHTML(this.greetingText, {
      reply_markup: {
        inline_keyboard: [this.buttons],
      },
    });
  }

  @Hears(CreateListingScene.URL_REGEX)
  async onUrl(ctx: Context) {
    const [url, _rest] = ctx.match;
    let title: string;
    try {
      title = await this.listingService.getListing(url);
    } catch (e) {
      console.warn(e);
      title = "ERROR";
    }
    if (!title) title = "ERROR";
    console.log({ title });
    await ctx.replyWithHTML(title);
  }

  // @Action(HOME_SCENE_ID)
  // async onHome(ctx: Context) {
  //   await ctx.scene.enter(HOME_SCENE_ID);
  // }
  @Action(MY_LISTINGS_ID)
  async onCreate(ctx: Context) {
    await ctx.scene.enter(MY_LISTINGS_ID);
  }
}
