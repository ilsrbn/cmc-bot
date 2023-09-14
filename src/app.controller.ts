import { Controller, Get } from "@nestjs/common";
import { SubscriptionService } from "./services";

@Controller("api")
export class AppController {
  constructor(private subscriptionService: SubscriptionService) {}
  @Get("/analytics")
  async getAnalytics() {
    return await this.subscriptionService.getGrouupedByUserSubscriptions();
  }
}
