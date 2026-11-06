// src/fuel-requests/fuel-request.module.ts
import { Module } from '@nestjs/common';
import { FuelRequestService } from './fuel-request.service';
import { FuelRequestController } from './fuel-request.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FuelRequestController],
  providers: [FuelRequestService],
  exports: [FuelRequestService],
})
export class FuelRequestModule {}
