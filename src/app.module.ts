import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExternoModule } from './externo/externo.module';
import { CotacaoModule } from './cotacao/cotacao.module';

@Module({
    imports: [ScheduleModule.forRoot(), ExternoModule, CotacaoModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
