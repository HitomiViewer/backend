import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Favorite } from './entity/favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async getFavorites(userId: string): Promise<Favorite | null> {
    return await this.favoriteRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async createFavorite(userId: string, favorites: number[]): Promise<void> {
    const favorite = this.favoriteRepository.create({
      user: { id: userId },
      favorites,
    });
    await this.favoriteRepository.save(favorite);
  }
}
