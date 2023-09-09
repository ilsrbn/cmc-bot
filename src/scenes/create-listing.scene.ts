import { Scene, SceneEnter, Action, Hears } from "nestjs-telegraf";

import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { Context } from "@context";

import { ListingService, UserService } from "@services";

import { MY_LISTINGS_ID, CREATE_LISTING_ID } from "@/app.constants";
import { Listing, NewListing } from "@/models/listing.model";

type isNewT = {
  isNew: boolean;
};

type CreateListingSceneState = {
  listing: Listing & isNewT;
};

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

  constructor(
    private readonly listingService: ListingService,
    private userService: UserService
  ) {}

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
    const [url] = ctx.match;
    const userId = ctx.from.id;
    let listing;
    try {
      listing = await this.listingService.getListing(url, userId);
    } catch (e) {
      console.warn(e);
    }
    if (!listing) {
      await ctx.replyWithHTML("Such listing not found");
      return await ctx.scene.enter(MY_LISTINGS_ID);
    }
    const message = this.makeListingMesssage(listing);
    ctx.scene.state = { listing };
    const buttons = [{ text: "Back", callback_data: MY_LISTINGS_ID }];
    if (listing && !listing.inFavourite)
      buttons.unshift({ text: "Add to favourites", callback_data: "YES" });
    await ctx.replyWithHTML(message, {
      reply_markup: {
        inline_keyboard: [buttons],
      },
    });
  }

  @Action("YES")
  async onAddToFavourites(ctx: Context) {
    const listing = ctx.scene.state as CreateListingSceneState;
    const userId = ctx.from.id;

    await this.listingService.addToFavourite(
      listing.listing,
      listing.listing.isNew,
      userId
    );
    await ctx.replyWithHTML("Done!");
    await ctx.scene.enter(MY_LISTINGS_ID);
  }

  @Action(MY_LISTINGS_ID)
  async onCreate(ctx: Context) {
    await ctx.scene.enter(MY_LISTINGS_ID);
  }

  private makeListingMesssage(listing: NewListing) {
    return (
      `<b>${listing.title}</b>` +
      "\n\n" +
      `\tPrice: <b>$${listing.price}</b>` +
      "\n" +
      `\tHolders: <b>${listing.holders || "-"}</b>` +
      "\n" +
      `\tTotal Liquidity: <b>${listing.liquidity || "-"}</b>`
    );
  }
}
