import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeService {

    paymentData(){
        return "Here will return all the payment data on stripe."
    }

    paymentCreate(data){
        return data;
    }
}
