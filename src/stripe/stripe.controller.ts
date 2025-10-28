import { Body, Controller, Get, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreatePaypentDto } from './dto/stripe-create.dto';

@Controller('stripe')
export class StripeController {
    constructor(private stripeService: StripeService){}

    @Get()
    allPayment(){
        return this.stripeService.paymentData();
    }

    @Post()
    createPayment(@Body() data: CreatePaypentDto){
        return this.stripeService.paymentCreate(data);
    }

    @Get('payment/success')
    paymentSuccess(){
        return " Wow greate work you successfully wasted your money.";
    }
}
