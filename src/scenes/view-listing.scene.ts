import { MY_LISTINGS_ID, VIEW_LISTING_ID } from "@/app.constants";
import { Context } from "@/interfaces/context.interface";
import { Listing } from "@/models/listing.model";
import { ListingRepository } from "@/repositories";
import { FavouriteService, ListingService } from "@/services";
import { Action, Scene, SceneEnter } from "nestjs-telegraf";

type SceneState = {
  id: number;
  deletion: boolean;
};

@Scene(VIEW_LISTING_ID)
export class ViewListingScene {
  constructor(
    private listingRepo: ListingRepository,
    private favouriteService: FavouriteService
  ) { }

  @SceneEnter()
  async onEnter(ctx: Context) {
    const state = ctx.scene.state as SceneState;

    const listing = await this.listingRepo.getListingById(state.id);
    await ctx.replyWithHTML(this.makeListingMesssage(listing), {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🗑 Delete", callback_data: "YES" },
            { text: "🔙 Go Back", callback_data: MY_LISTINGS_ID },
          ],
        ],
      },
    });
  }

  @Action("YES")
  async onDelete(ctx: Context) {
    (ctx.scene.state as SceneState).deletion = true;
    await ctx.replyWithHTML(
      "Are you sure you want to delete the listing from your Favourites?",
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🗑 Yes, delete listing.", callback_data: "CONFIRM" },
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
    const userId = ctx.from.id;
    const listingId = (ctx.scene.state as SceneState).id;
    await this.favouriteService.delete(userId, listingId);
    return await this.onGoBack(ctx);
  }

  @Action(MY_LISTINGS_ID)
  async onGoBack(ctx: Context) {
    (ctx.scene.state as SceneState).id = null;
    (ctx.scene.state as SceneState).deletion = false;
    return await ctx.scene.enter(MY_LISTINGS_ID);
  }

  private makeListingMesssage(listing: Listing) {
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
