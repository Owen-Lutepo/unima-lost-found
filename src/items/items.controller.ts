import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ClaimsService } from '../claims/claims.service';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateClaimDto } from '../claims/dto/create-claim.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('categories')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly claimsService: ClaimsService, 
  ) {}

  //  Get all unique categories (e.g., ID, Electronics, Keys)
  @Get()
  async getCategories() {
    return this.itemsService.getCategories();
  }

  //  Get list of items within a specific category
  @Get(':category/itmslist')
  async getList(@Param('category') category: string) {
    return this.itemsService.findByCategory(category);
  }

  //  Get specific item details (Phone is hidden here)
  @Get(':category/itmslist/:id')
  async getDetails(@Param('id') id: number) {
    return this.itemsService.findOne(id);
  }

  //  Post a new item (Requires Login)
  @UseGuards(JwtAuthGuard) // Re-add the guard
  @Post('form')
    async create(@Body() dto: CreateItemDto, @Req() req) {
      // req.user is now populated by the JwtStrategy
      return this.itemsService.create(dto, req.user);
  }
  //  THE CLAIM PATH: /categories/:category/itmslist/:id/claim
  @UseGuards(JwtAuthGuard)
  @Post(':category/itmslist/:id/claim')
  async claimItem(
    @Param('id') id: number,
    @Body() dto: CreateClaimDto,
    @Req() req,
  ) {
    // This calls the service to flip status and reveal the 'reward'
    return this.claimsService.createClaimRecord(id, req.user, dto);
  }
}