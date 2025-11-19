import {
    Controller,
    Get,
    ParseFloatPipe,
    Query,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { CotacaoService } from './cotacao.service';

@Controller('cotacao')
export class CotacaoController {
    constructor(private readonly cotacaoService: CotacaoService) {}

    @Get('converter')
    async converterMoeda(
        @Query('de') de: string,
        @Query('para') para: string,
        @Query('valor', ParseFloatPipe) valor: number,
    ): Promise<number> {
        if (!de || !para) {
            throw new HttpException(
                'Os parâmetros "de" e "para" são obrigatórios.',
                HttpStatus.BAD_REQUEST,
            );
        }
        try {
            return await this.cotacaoService.converterMoeda(valor, de, para);
        } catch (error: any) {
            throw new HttpException(
                error.message || 'Erro ao converter moeda',
                HttpStatus.NOT_FOUND,
            );
        }
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
