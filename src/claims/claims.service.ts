import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from './entities/claim.entity';
import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { CreateClaimDto } from './dto/create-claim.dto';


@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim) private readonly claimsRepo: Repository<Claim>,
    @InjectRepository(Item) private readonly itemsRepo: Repository<Item>,
  ) {}

  //The main logic for claim endpoint is implemented here.
async createClaimRecord(itemId: number, user: any, dto: CreateClaimDto) {
    const item = await this.itemsRepo.findOne({
      where: { id: itemId },
      relations: ['founder'],
    });

    if (!item) throw new NotFoundException('Item not found');
    if (item.status === 'claimed') throw new BadRequestException('Item already claimed');

    // Updating status of an item from available to claimed
    item.status = 'claimed';
    await this.itemsRepo.save(item);

    // Create the record to keep track of the who claimed and what got claimed
    const claim = this.claimsRepo.create({
      claimantPhone: dto.phone,
      item: item,
      claimant: { id: user.userId } as any, // Link the user using the ID from the JWT
    });
    
    await this.claimsRepo.save(claim);

    return {
      message: 'Claim successful!',
      reward: {
        founderPhone: item.founder.phone,
        founderEmail: item.founder.email,
      }
    };
}
 //endpoint to get all claimed items
  async findAllClaimed() {
    return this.claimsRepo.find({ 
      relations: ['item', 'claimant'] 
    });
  }
 
  //We fix the ptoblem with Missing method here.
  async findClaimById(id: number) {
    const claim = await this.claimsRepo.findOne({
      where: { id },
      relations: ['item', 'claimant']
    });

    if (!claim) throw new NotFoundException(`Claim with ID ${id} not found`);
    return claim;
  }
}