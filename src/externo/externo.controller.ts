import { Controller, Get, Query } from '@nestjs/common';
import { ExternoService } from './externo.service';

@Controller('externo')
export class ExternoController {
    constructor(private readonly externoService: ExternoService) {}

    @Get('dados')
    async pegarDadosExternos(@Query('url') url: string): Promise<any[]> {
        return this.externoService.pegarDadosExternos(url);
    }
}
