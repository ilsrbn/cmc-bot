import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import { ScheduleModule } from "@nestjs/schedule";

import { AppService } from "./app.service";

import { sessionMiddleware } from "./middleware/session.middleware";
import { BOT_NAME } from "./app.constants";

import {
  IndicatorRepository,
  UserRepository,
  ListingRepository,
  SubscriptionRepository,
  FavouriteRepository,
} from "@repos";

import {
  UserService,
  SubscriptionService,
  ListingService,
  IndicatorService,
  FavouriteService,
} from "@services";
import { ParserService } from "@services/parser/index";
import { CurrencyParser } from "@services/parser/currency";
import { DexScanParser } from "@/services/parser/dexscan";

import {
  HomeScene,
  MyListingsScene,
  CreateListingScene,
  ViewListingScene,
  AllSubscriptionsScene,
  CreateSubscriptionScene,
} from "@scenes";

import { UrlUtils } from "@utils";

import "dotenv/config";

@Module({
  imports: [
    TelegrafModule.forRoot({
      botName: BOT_NAME,
      token: process.env.BOT_TOKEN,
      middlewares: [sessionMiddleware],
    }),
    ScheduleModule.forRoot(),
  ],

  providers: [
    AppService,

    IndicatorRepository,
    ListingRepository,
    SubscriptionRepository,
    UserRepository,
    FavouriteRepository,

    UserService,
    SubscriptionService,
    ListingService,
    IndicatorService,
    ParserService,
    FavouriteService,

    CurrencyParser,
    DexScanParser,

    HomeScene,
    AllSubscriptionsScene,
    CreateSubscriptionScene,
    MyListingsScene,
    ViewListingScene,
    CreateListingScene,

    UrlUtils,
  ],
})
export class AppModule { }
