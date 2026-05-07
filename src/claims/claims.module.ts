import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimsService } from './entities/claims.service';
import { ClaimsController } from './claims.controller';
import { Claim } from './entities/claim.entity';
import { Item } from '../items/entities/item.entity';
import { ItemsModule } from '../items/items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Claim, Item]),
    forwardRef(() => ItemsModule),
  ],
  providers: [ClaimsService],
  controllers: [ClaimsController],
  exports: [ClaimsService],
})
export class ClaimsModule {}