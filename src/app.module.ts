import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BranchModule } from './branch/branch.module';
import { UsersModule } from './users/users.module';
import { VehicleModule } from './vehicles/vehicle.module';
import { FuelSessionModule } from './fuel-sessions/fuel-session.module';
import { FuelRequestModule } from './fuel-requests/fuel-request.module';
import { FinanceModule } from './finance/finance.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    BranchModule,
    VehicleModule,
    FuelSessionModule,
    FuelRequestModule,
    FinanceModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
