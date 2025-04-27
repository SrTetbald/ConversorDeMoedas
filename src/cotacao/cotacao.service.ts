import { Injectable, OnModuleInit } from '@nestjs/common';
import { ExternoService } from 'src/externo/externo.service';

interface ICotacao {
    Data: string;
    CodMoeda: string;
    Tipo: string;
    Moeda: string;
    TaxaCompra: string;
    TaxaVenda: string;
    ParidadeCompra: string;
    ParidadeVenda: string;
}

@Injectable()
export class CotacaoService implements OnModuleInit {
    private cotacoes: ICotacao[] = [];
    private readonly conteudoCsv = 'https://www4.bcb.gov.br/Download/fechamento/20250425.csv';

    constructor(private readonly externoService: ExternoService) {}

    async onModuleInit() {
        await this.carregarCotacoes()
        console.log('Cotacoes carregadas:', this.cotacoes);
    }

    async carregarCotacoes() {
        const dadosExternos = await this.externoService.pegarDadosExternos(this.conteudoCsv);
        this.cotacoes = dadosExternos.map((dado) => {
            return {
                Data: dado.Data,
                CodMoeda: dado.CodMoeda,
                Tipo: dado.Tipo,
                Moeda: dado.Moeda,
                TaxaCompra: dado.TaxaCompra.replace(',', '.'),
                TaxaVenda: dado.TaxaVenda.replace(',', '.'),
                ParidadeCompra: dado.ParidadeCompra.replace(',', '.'),
                ParidadeVenda: dado.ParidadeVenda.replace(',', '.'),
            };
        });
    }

    async pegarCotacoes(): Promise<ICotacao[]> {
        return this.cotacoes;
    }
}
