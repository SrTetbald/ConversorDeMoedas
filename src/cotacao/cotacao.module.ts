import { Module } from '@nestjs/common';
import { CotacaoService } from './cotacao.service';
import { CotacaoController } from './cotacao.controller';
import { ExternoModule } from 'src/externo/externo.module';

@Module({
    imports: [ExternoModule],
    providers: [CotacaoService],
    controllers: [CotacaoController],
})
export class CotacaoModule {}
