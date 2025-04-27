import { Body, Controller, Get } from '@nestjs/common';
import { CotacaoService } from './cotacao.service';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

class ConverterMoedaDto {
    @IsNotEmpty()
    @IsString()
    de: string;

    @IsNotEmpty()
    @IsString()
    para: string;

    @IsNotEmpty()
    @IsNumber()
    valor: number;
}

@Controller('cotacao')
export class CotacaoController {
    constructor(private readonly cotacaoService: CotacaoService) {}

    @Get('conver')
    async mostrarCotacoes(): Promise<any[]> {
        return this.cotacaoService.pegarCotacoes();
    }

    @Get('converter')
    async converterMoeda(
        @Body() converterMoedaDto: ConverterMoedaDto,
    ): Promise<number> {
        return this.cotacaoService.converterMoeda(
            converterMoedaDto.valor,
            converterMoedaDto.de,
            converterMoedaDto.para,
        );
    }
}
