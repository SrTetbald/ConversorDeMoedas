import { Module } from '@nestjs/common';
import { ExternoService } from './externo.service';
import { ExternoController } from './externo.controller';

@Module({
    providers: [ExternoService],
    controllers: [ExternoController],
})
export class ExternoModule {}
