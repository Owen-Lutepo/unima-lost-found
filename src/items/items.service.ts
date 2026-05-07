import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepo: Repository<Item>,
  ) {}

  async create(createItemDto: any, user: any) {
    const newItem = this.itemsRepo.create({
      ...createItemDto,
      // FIX: Change 'user' to 'founder' to match your Item Entity!
      founder: { id: user.userId } 
    });
    
    try {
      return await this.itemsRepo.save(newItem);
    } catch (error) {
      console.error("Database Save Error:", error);
      throw error;
    }
  }

  async getCategories() {
    const result = await this.itemsRepo
      .createQueryBuilder('item')
      .select('DISTINCT item.category', 'category')
      .where('item.status = :status', { status: 'available' })
      .getRawMany();
    return result.map(res => res.category);
  }

  async findByCategory(category: string): Promise<Item[]> {
    return await this.itemsRepo.find({
      where: { category, status: 'available' },
    });
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itemsRepo.findOne({ 
      where: { id },
      relations: ['founder'] 
    });
    if (!item) throw new NotFoundException('Item not found');

    // SECURITY: Hide phone number for standard detail viewing
    if (item.status === 'available') {
      item.founder.phone = 'HIDDEN_UNTIL_CLAIMED';
    }
    return item;
  }
}