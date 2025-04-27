import { Module } from '@nestjs/common';
import { CotacaoService } from './cotacao.service';
import { CotacaoController } from './cotacao.controller';
import { ExternoService } from 'src/externo/externo.service';

@Module({
  providers: [CotacaoService, ExternoService],
  controllers: [CotacaoController]
})
export class CotacaoModule {}
