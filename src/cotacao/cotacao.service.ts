import { Injectable, OnModuleInit } from '@nestjs/common';
import { format, subDays } from 'date-fns';
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
        `https://www4.bcb.gov.br/Download/fechamento/`
        //20250425.csv;

    constructor(private readonly externoService: ExternoService) {}

    async onModuleInit() {
        await this.carregarCotacoes();
        this.adicionarMoedaPadrao();
        // console.log('Cotacoes carregadas:', this.cotacoes);
        
    }

    async carregarCotacoes(loop = 0, maxLoop = 3) {
        const dataAtual = subDays(new Date(), loop);
        const dataFormatada = format(dataAtual, 'yyyyMMdd');
        const url = `https://www4.bcb.gov.br/Download/fechamento/${dataFormatada}.csv`;

        try{
            const dadosExternos = await this.externoService.pegarDadosExternos(url);
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
            console.log(`Cotacoes carregadas na data: ${dataFormatada}`);
        }catch (error: any){
            console.log(`Erro ao carregar cotacoes na data: ${dataFormatada}`, /*error.message*/);
            if (loop < maxLoop) {
                console.log(`Tentando novamente... (${loop + 1}/${maxLoop})` );
                await this.carregarCotacoes(loop + 1, maxLoop);
            } else {
                console.log('Máximo de tentativas atingido. Não foi possível carregar as cotações.');
            }
        }
        //this.adicionarMoedaPadrao();
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
