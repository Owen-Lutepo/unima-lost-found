import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  // 1. Get a list of all successful claims (History)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllClaims() {
    return this.claimsService.findAllClaimed();
  }

  // 2. Get a specific claim record by its ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOneClaim(@Param('id') id: number) {
    // This would return who claimed what and their phone
    return this.claimsService.findClaimById(id);
  }
}