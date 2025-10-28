import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Add this import
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { StripePayment } from './entities/stripe.entity';

@Injectable()
export class StripeService {
    private readonly apiKey: string;
    private readonly secret: string;
    private stripe: Stripe;

    constructor(
        private configService: ConfigService, 
        @InjectRepository(StripePayment) // Add this decorator
        private paymentRepository: Repository<StripePayment>
    ) {
        this.apiKey = this.configService.get('STRIPE_KEY') || '';
        this.secret = this.configService.get('STRIPE_SECRET') || '';

        this.stripe = new Stripe(this.secret);
    }

    paymentData() {
        return "Here will return all the payment data on stripe."
    }

    async paymentCreate(data) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: `Payment from ${data.name}` },
                        unit_amount: data.amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${this.configService.get('App_Url')}/stripe/payment/success?session_id={CHECKOUT_SESSION_ID}`, // Add session_id parameter
            cancel_url: `${this.configService.get('App_Url')}/stripe/payment/cancel?session_id={CHECKOUT_SESSION_ID}`, // Add session_id parameter
            metadata: {
                name: data.name,
                email: data.email,
                location: data.location,
            },
        });

        const paymentData = this.paymentRepository.create({
            stripe_session_id: session.id,
            customer_name: data.name,
            customer_email: data.email,
            amount: data.amount,
            location: data.location,
            status: 'pending',
            metadata: session,
        })
        const saveData = await this.paymentRepository.save(paymentData); // Add await

        return {
            status: saveData.status,
            message: 'Payment session created successfully',
            paymentUrl: session.url,
            sessionId: session.id, // Return session ID for testing
        }
    }

    async UpdatePaymentStatus(sessionId: string, status: string) {
        const payment = await this.paymentRepository.findOne({
            where: { stripe_session_id: sessionId },
        });

        if (!payment) {
            throw new BadRequestException('Payment Record Not Found');
        }
        payment.status = status;

        return await this.paymentRepository.save(payment);
    }
}