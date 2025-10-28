import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripePayment } from './entities/stripe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StripePayment]),
  ],
  controllers: [StripeController],
  providers: [StripeService]
})
export class StripeModule {}
