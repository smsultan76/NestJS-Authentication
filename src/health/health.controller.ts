import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm/browser';

@Controller('health')
export class HealthController {
    // constructor(
    //     @InjectConnection()
    //     private readonly connection: Connection,
    // ){}
    
    // @Get()
    // async check() {
    //     try {
    //         await this.connection.query('SELECT 1');
    //         return {
    //             status: 'ok',
    //             database: 'connected',
    //             timestamp: new Date().toISOString(),
    //         };
    //     } catch (error){
    //         return {
    //             status: 'error',
    //             database: 'disconnected',
    //             error: error.message,
    //             timestamp: new Date().toISOString(),
    //         };
    //     }
    // }
}
