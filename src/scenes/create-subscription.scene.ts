import axios from "axios";
import cheerio from "cheerio";
import { Telegraf } from "telegraf";

import {
  Scene,
  SceneEnter,
  Action,
  On,
  Message,
  InjectBot,
  Command,
} from "nestjs-telegraf";

import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { Context } from "@context";
import { Pair } from "@/interfaces/pair.interface";

import {
  HOME_SCENE_ID,
  CREATE_SUBSCRIPTION_SCENE_ID,
  ALL_SUBSCRIPTIONS_SCENE_ID,
  BOT_NAME,
} from "@/app.constants";

@Scene(CREATE_SUBSCRIPTION_SCENE_ID)
export class CreateSubscriptionScene {
  constructor(
    @InjectBot(BOT_NAME)
    private readonly bot: Telegraf<Context>
  ) { }
  private statsSelector = ".dexscan-detail-stats-section > dl";

  private greetingText(pairs: Array<Pair>): string {
    return (
      "Please, send link of the pair you want to keep track of" +
      (pairs.length ? " or select one from previously tracked" : "")
    );
  }

  @SceneEnter()
  async onEnter(ctx: Context) {
    await ctx.replyWithHTML(this.greetingText([]), {
      reply_markup: {
        inline_keyboard: this.getButtons([]),
      },
    });
  }

  @Action(HOME_SCENE_ID)
  async onLook(ctx: Context) {
    await ctx.scene.enter(HOME_SCENE_ID);
  }

  private getButtons(pairs: Array<Pair>): InlineKeyboardButton[][] {
    return [
      pairs.map((pair) => ({ text: pair.pair, callback_data: pair.pair })),
      [ALL_SUBSCRIPTIONS_SCENE_ID, HOME_SCENE_ID].map((button) => ({
        text: button,
        callback_data: button,
      })),
    ];
  }

  @Command("start")
  async onStart(ctx: Context) {
    await ctx.scene.enter(HOME_SCENE_ID);
  }

  @On("text")
  async handleLink(@Message("text") text: string) {
    // const indexOfPair = ctx.session.pairs.findIndex(
    // (pair) => pair.link === text.trim()
    // );

    // if (indexOfPair !== -1) {
    // console.log("Me");
    // }

    const searchResults = text.search("currencies");
    if (searchResults !== -1) {
    }
    const page = await axios.get(text.trim());
    const $ = cheerio.load(page.data);
    const title = $("h1.dexscan-pair-source-pair").eq(0).text();
    const price = $(".priceSection-core > div > span > span").text();
    const totalLiquidity = $(
      this.statsSelector + " div:first-child dd span"
    ).text();
    console.log(this.bot.context);
    return `${title}\n\n\bPrice: ${price}\n\bTotal liquidity: ${totalLiquidity}`;
  }
}
