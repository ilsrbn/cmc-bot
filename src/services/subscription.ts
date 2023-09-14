import * as _ from "lodash";
import { Injectable, Logger } from "@nestjs/common";

import { SubscriptionRepository } from "@/repositories/subscription";

import { ListingService } from "./listing";

export class CreateSubscriptionDTO {
  constructor(
    public user_id: number,
    public listing_id: number,
    public initial: number,
    public target: number,
    public type: "price" | "holders" | "liquidity"
  ) {}
}

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly listingService: ListingService
  ) {}

  async getSubscriptionById(id: number) {
    return await this.subscriptionRepository.getSubscriptionById(id);
  }

  async getAllSubscription(userId: number) {
    return await this.subscriptionRepository.getUserSubscriptions(userId);
  }

  async createSubscription(createDTO: CreateSubscriptionDTO) {
    return await this.subscriptionRepository.createSubscription({
      ...createDTO,
    });
  }

  async getAllSubscriptions() {
    return await this.subscriptionRepository.getAllSubscrtiptions();
  }

  async getGrouupedByUserSubscriptions() {
    const subscriptions = await this.getAllSubscriptions();
    return _.groupBy(subscriptions, (subscription) => subscription.user_id);
  }

  async getGrouppedSubscriptions() {
    const subscriptions = await this.getAllSubscriptions();
    return _.groupBy(subscriptions, (subscription) => subscription.listing_id);
  }

  async requestUpdate(id: number) {
    this.logger.debug(``);
    this.logger.debug(`REQUESTED UPDATE CHECK OF SUBSCRIPTION WITH ID "${id}"`);
    const subscription = await this.subscriptionRepository.getSubscriptionById(
      id
    );

    this.logger.verbose("DONE");
    const listing = await this.listingService.getListingById(
      subscription.listing_id
    );

    const initial = subscription.initial;
    const current = listing[subscription.type];
    const target = subscription.target;

    return target > initial ? current >= target : current <= target;
  }

  async delete(id: number) {
    this.logger.debug(``);
    this.logger.debug(`REQUESTED DELETE OF SUBSCRIPTION WITH ID "${id}"`);
    await this.subscriptionRepository.deleteById(id);
    this.logger.verbose("DONE");
  }
}
