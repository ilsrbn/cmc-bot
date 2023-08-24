import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";

import { AppService } from "./app.service";

import { sessionMiddleware } from "./middleware/session.middleware";
import { BOT_NAME } from "./app.constants";

import {
  IndicatorRepository,
  UserRepository,
  ListingRepository,
  SubscriptionRepository,
} from "@repos";

import {
  UserService,
  SubscriptionService,
  ListingService,
  IndicatorService,
} from "@services";

import {
  HomeScene,
  MyListingsScene,
  CreateListingScene,
  AllSubscriptionsScene,
  CreateSubscriptionScene,
} from "@scenes";

import "dotenv/config";

@Module({
  imports: [
    TelegrafModule.forRoot({
      botName: BOT_NAME,
      token: process.env.BOT_TOKEN,
      middlewares: [sessionMiddleware],
    }),
  ],

  providers: [
    AppService,

    IndicatorRepository,
    ListingRepository,
    SubscriptionRepository,
    UserRepository,

    UserService,
    SubscriptionService,
    ListingService,
    IndicatorService,

    HomeScene,
    AllSubscriptionsScene,
    CreateSubscriptionScene,
    MyListingsScene,
    CreateListingScene,
  ],
})
export class AppModule { }
