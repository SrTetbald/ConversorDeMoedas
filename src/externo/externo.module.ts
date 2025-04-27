import { Module } from '@nestjs/common';
import { ExternoService } from './externo.service';

@Module({
    providers: [ExternoService],
    controllers: [],
})
export class ExternoModule {}
