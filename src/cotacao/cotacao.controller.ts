import { Controller, Get } from '@nestjs/common';
import { CotacaoService } from './cotacao.service';

@Controller('cotacao')
export class CotacaoController {
    constructor(private readonly cotacaoService: CotacaoService) {}

    @Get('conver')
    async mostrarCotacoes(): Promise<any[]> {
        return this.cotacaoService.pegarCotacoes();
    }
}
