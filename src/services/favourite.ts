import { Injectable } from "@nestjs/common";

import { FavouriteRepository } from "@repos";

@Injectable()
export class FavouriteService {
  constructor(private readonly favouriteRepository: FavouriteRepository) { }

  async getFavourite(user_id: number, listing_id: number) {
    try {
      return await this.favouriteRepository.getListing(user_id, listing_id);
    } catch (e) {
      return false;
    }
  }

  async addToFavourite(user_id: number, listing_id: number) {
    return await this.favouriteRepository.create({ listing_id, user_id });
  }

  async getUsersFavourites(user_id: number) {
    return await this.favouriteRepository.getByUserId(user_id);
  }

  async delete(user_id: number, listing_id: number) {
    return await this.favouriteRepository.delete(user_id, listing_id);
  }
}
