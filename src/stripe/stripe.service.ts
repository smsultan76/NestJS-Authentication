import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private readonly apiKey: string;
    private readonly secret: string;
    private stripe: Stripe;

    constructor(private configService: ConfigService){
        this.apiKey = this.configService.get('STRIPE_KEY') || '';
        this.secret = this.configService.get('STRIPE_SECRET') || '';

        this.stripe = new Stripe(this.secret);
    }
    paymentData(){
        return "Here will return all the payment data on stripe."
    }

    async paymentCreate(data){
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: `Payment from ${ data.name }`},
                        unit_amount: data.amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${ this.configService.get('App_Url') }/stripe/payment/success`,
            cancel_url: `${ this.configService.get('App_Url') }/stripe/payment/cancel`,
            metadata: {
                name: data.name,
                email: data.email,
                location: data.location,
            },
        });
        return {
            status: 'pending',
            message: 'Payment session created successfully',
            url: session,
        }
    }
}
