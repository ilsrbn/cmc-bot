import { Scene, SceneEnter, Action, Hears } from "nestjs-telegraf";

import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { Context } from "@context";

import {
  HOME_SCENE_ID,
  CREATE_SUBSCRIPTION_SCENE_ID,
  ALL_SUBSCRIPTIONS_SCENE_ID,
} from "@/app.constants";
import {
  CreateSubscriptionDTO,
  FavouriteService,
  SubscriptionService,
} from "@/services";
import { Listing } from "@/models/listing.model";

type SceneState = {
  listing_id: number;
  selected_type: "price" | "holders" | "liquidity";
};

const IntegetOrFloatRegexp = /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/;

@Scene(CREATE_SUBSCRIPTION_SCENE_ID)
export class CreateSubscriptionScene {
  private favourites: Listing[];
  private formatter = new Intl.ListFormat("en", {
    style: "long",
    type: "disjunction",
  });

  constructor(
    private favouriteService: FavouriteService,
    private subscriptionService: SubscriptionService
  ) { }

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
    const pairsButtons = pairs.map((pair) => [
      {
        text: "☑️ " + pair.title,
        callback_data: pair.id.toString(),
      },
    ]);

    return [
      ...pairsButtons,
      [ALL_SUBSCRIPTIONS_SCENE_ID, HOME_SCENE_ID].map((button) => ({
        text: button,
        callback_data: button,
      })),
    ];
  }

  @Action(ALL_SUBSCRIPTIONS_SCENE_ID)
  async onGoBack(ctx: Context) {
    await ctx.scene.enter(ALL_SUBSCRIPTIONS_SCENE_ID);
  }

  @Action(/[0-9]+/)
  async onSelectedPair(ctx: Context) {
    this.setListingId(ctx);
    const found = this.getListing(ctx);
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

  @Action(["price", "holders", "liquidity"])
  async onSelectType(ctx: Context) {
    this.setSelectedType(ctx);
    await ctx.replyWithHTML(
      "Enter exact value you want to subscribe on:\n\n<i>Format: number with 'dot' symbol (.) as decimal separator</i>"
    );
  }

  @Hears(IntegetOrFloatRegexp)
  async onEnterValue(ctx: Context) {
    if (!this.getSelectedType(ctx)) return null;

    const target = parseFloat(ctx.match[0]);
    if (!target) return null;

    const newSubscriptionDTO = new CreateSubscriptionDTO(
      ctx.from.id,
      this.getListingId(ctx),
      this.getListing(ctx)[this.getSelectedType(ctx)],
      target,
      this.getSelectedType(ctx)
    );

    await this.subscriptionService.createSubscription(newSubscriptionDTO);

    await ctx.scene.enter(ALL_SUBSCRIPTIONS_SCENE_ID);
  }

  private getSelectedType(
    ctx: Context
  ): "price" | "holders" | "liquidity" | null {
    return (ctx.scene.state as SceneState).selected_type;
  }

  private setSelectedType(ctx: Context): "price" | "holders" | "liquidity" {
    const [selectedType] = ctx.match;
    (ctx.scene.state as SceneState).selected_type = selectedType;
    return selectedType;
  }

  private getListingId(ctx: Context): number | null {
    return (ctx.scene.state as SceneState).listing_id;
  }

  private setListingId(ctx: Context): number {
    const [listingId] = ctx.match;
    (ctx.scene.state as SceneState).listing_id = listingId;
    return listingId;
  }

  private getListing(ctx: Context) {
    const listingId = this.getListingId(ctx);
    const listingIdx = this.favourites?.findIndex((el) => el.id === +listingId);
    return this.favourites[listingIdx] || null;
  }
}
