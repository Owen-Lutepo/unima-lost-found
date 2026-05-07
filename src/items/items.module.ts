import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { Item } from './entities/item.entity';
import { ClaimsModule } from '../claims/claims.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item]),
    forwardRef(() => ClaimsModule),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService, TypeOrmModule], 
})
export class ItemsModule {}