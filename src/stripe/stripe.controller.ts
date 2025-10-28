import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreatePaypentDto } from './dto/stripe-create.dto';

@Controller('stripe')
export class StripeController {
    constructor(private stripeService: StripeService){}

    @Get()
    allPayment(@Query() page: number, last: number){
        return this.stripeService.paymentData(page, last);
    }

    @Post()
    createPayment(@Body() data: CreatePaypentDto){
        return this.stripeService.paymentCreate(data);
    }

    @Get('payment/success')
    async paymentSuccess(@Query('session_id') sessionId: string){
        await this.stripeService.UpdatePaymentStatus( sessionId, "completed");
        return "Wow greate work. \n You successfully wasted your money.\n";
    }
    @Get('payment/cancel')
    async paymentCancel(@Query('session_id') sessionId: string){
        await this.stripeService.UpdatePaymentStatus( sessionId, "failed" );
        return "Wow greate work you Canceled. shame on you.!!!";
    }
}
