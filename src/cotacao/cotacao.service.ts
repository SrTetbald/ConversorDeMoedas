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
    private readonly conteudoCsv =
        'https://www4.bcb.gov.br/Download/fechamento/20250425.csv';

    constructor(private readonly externoService: ExternoService) {}

    async onModuleInit() {
        await this.carregarCotacoes();
        console.log('Cotacoes carregadas:', this.cotacoes);
    }

    async carregarCotacoes() {
        const dadosExternos = await this.externoService.pegarDadosExternos(
            this.conteudoCsv,
        );

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
        this.adicionarMoedaPadrao();
    }

    adicionarMoedaPadrao() {
        const moedaPadrao: ICotacao = {
            Data: '2025-04-26',
            CodMoeda: 'BRL',
            Tipo: 'Real',
            Moeda: 'BRL',
            TaxaCompra: '1',
            TaxaVenda: '1',
            ParidadeCompra: '1.00',
            ParidadeVenda: '1.00',
        };
        this.cotacoes.push(moedaPadrao);
    }

    async pegarCotacoes(): Promise<ICotacao[]> {
        return this.cotacoes;
    }

    async converterMoeda(
        valor: number,
        de: string,
        para: string,
    ): Promise<number> {
        const cotacaoDe = this.cotacoes.find((cotacao) => cotacao.Moeda === de);
        const cotacaoPara = this.cotacoes.find(
            (cotacao) => cotacao.Moeda === para,
        );

        if (!cotacaoDe || !cotacaoPara) {
            throw new Error('Moeda não encontrada.');
        }

        //const taxaCompraDe = parseFloat(cotacaoDe.TaxaCompra);
        //const taxaVendaPara = parseFloat(cotacaoPara.TaxaVenda);
        const taxaMédiaDe =
            (parseFloat(cotacaoDe.TaxaVenda) +
                parseFloat(cotacaoDe.TaxaCompra)) /
            2;
        const taxaMédiaPara =
            (parseFloat(cotacaoPara.TaxaVenda) +
                parseFloat(cotacaoPara.TaxaCompra)) /
            2;
        const cambio = taxaMédiaDe / taxaMédiaPara;

        return valor * cambio;
    }
}
