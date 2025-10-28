import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('stripe_payments')
export class StripePayment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    stripe_session_id: string;

    @Column()
    customer_name: string;

    @Column()
    customer_email: string;

    @Column()
    amount: string;

    @Column()
    location: string;

    @Column({ default: 'pending' })
    status: string;

    @Column({ nullable:true })
    stripe_payment_intent_id: string;

    @Column({ type: 'jsonb', nullable:true })
    metadata: any;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;    
}