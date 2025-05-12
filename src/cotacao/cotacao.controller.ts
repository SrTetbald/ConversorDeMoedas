import { Controller, Get, ParseFloatPipe, Query } from '@nestjs/common';
import { CotacaoService } from './cotacao.service';

@Controller('cotacao')
export class CotacaoController {
    constructor(private readonly cotacaoService: CotacaoService) {}

    @Get('converter')
    async converterMoeda(
        @Query('de') de: string,
        @Query('para') para: string,
        @Query('valor', ParseFloatPipe) valor: string,
    ): Promise<number> {
        if (!de || !para) {
            throw new Error('Os parâmetros "de" e "para" são obrigatórios.');
        }
        return this.cotacaoService.converterMoeda(valor, de, para);
    }

    @Get('moedas')
    async getMoedas(): Promise<any[]> {
        return this.cotacaoService.getMoedas();
    }
    @Get('cotacoes')
    async getCotacoes(): Promise<any[]> {
        return this.cotacaoService.getCotacoes();
    }
}
