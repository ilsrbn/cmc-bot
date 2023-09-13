import { Ctx, InjectBot, Start, Update } from "nestjs-telegraf";
import { BOT_NAME, HOME_SCENE_ID } from "@/app.constants";
import { Context } from "@/interfaces/context.interface";
import { ListingService, SubscriptionService, UserService } from "@services";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Logger } from "@nestjs/common";
import { parseInt } from "lodash";
import { Telegraf } from "telegraf";

@Update()
export class AppService {
  private readonly logger = new Logger("CRON");
  constructor(
    @InjectBot(BOT_NAME) private bot: Telegraf<Context>,
    private readonly userService: UserService,
    private readonly listingService: ListingService,
    private readonly subscriptionsService: SubscriptionService
  ) { }
  @Start()
  async onStart(@Ctx() ctx: Context) {
    // Initialize custom session values

    const userId = ctx.from.id;
    const user = await this.userService.getUser(userId);

    if (!user) await this.userService.register({ tg_id: userId });

    await ctx.scene.enter(HOME_SCENE_ID);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async updateSubscriptions() {
    try {
      this.logger.log("");
      this.logger.log("CRON JOB STARTED");
      this.logger.log("");
      const grouppedByListing =
        await this.subscriptionsService.getGrouppedSubscriptions();
      for (const key in grouppedByListing) {
        await this.listingService.requestUpdate(parseInt(key));
        for (const subscription of grouppedByListing[key]) {
          const needToNotify = await this.subscriptionsService.requestUpdate(
            subscription.id
          );
          if (needToNotify) {
            const message = `ATTENTION: Your subscription on "${subscription.title}" has reached value ${subscription.target}!`;
            await this.bot.telegram.sendMessage(subscription.user_id, message);
            await this.subscriptionsService.delete(subscription.id);
          }
        }
      }

      this.logger.log("CRON JOB SUCCEDED");
    } catch (e) {
      this.logger.error("ERROR", e);
    }
  }
}
