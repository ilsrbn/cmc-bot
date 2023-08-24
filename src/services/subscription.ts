import { SubscriptionRepository } from "@/repositories/subscription";
import { Injectable } from "@nestjs/common";

class CreateSubscriptionDTO {
  user_id: number;
  listing_id: number;
  indicator_id: number;
}

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository
  ) {}

  async getAllSubscription(userId: number) {
    return await this.subscriptionRepository.getUserSubscriptions(userId);
  }

  async createSubscription(createDTO: CreateSubscriptionDTO) {
    return await this.subscriptionRepository.createSubscription({
      ...createDTO,
    });
  }
}
