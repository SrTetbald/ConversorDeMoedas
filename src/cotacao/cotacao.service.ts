import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { format, subDays } from 'date-fns';
import { ExternoService } from 'src/externo/externo.service';
import { NOMES_MOEDAS } from 'src/externo/nome.moedas';

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

interface Imoedas {
    Moeda: string;
    Nome: string;
}

@Injectable()
export class CotacaoService implements OnModuleInit {
    private cotacoes: ICotacao[] = [];
    private arrayCodMoedas: Imoedas[] = [];

    constructor(private readonly externoService: ExternoService) {}

    async onModuleInit() {
        const urlBase = process.env.BASE_URL;
        await this.carregarCotacoes();
        this.adicionarMoedaPadrao();
        // console.log('Cotacoes carregadas:', this.cotacoes);
    }
    async carregarCotacoes(loop = 0, maxLoop = 4) {
        const dataAtual = subDays(new Date(), loop);
        const dataFormatada = format(dataAtual, 'yyyyMMdd');
        const url = `https://www4.bcb.gov.br/Download/fechamento/${dataFormatada}.csv`;
        //const url = `${process.env.BASE_URL}${dataFormatada}.csv`;

        try {
            const dadosExternos = await this.externoService.consultarDadosExternos(url);
            this.cotacoes = dadosExternos.map(dado => {
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
            this.arrayCodMoedas = dadosExternos.map(dado => {
                return {
                    Moeda: dado.Moeda,
                    Nome: NOMES_MOEDAS[dado.Moeda],
                };
            });
            console.log(`Cotacoes carregadas na data: ${dataFormatada}`);
        } catch (error: any) {
            console.log(`Erro ao carregar cotacoes na data: ${dataFormatada}`, error.message);
            if (loop < maxLoop) {
                console.log(`Tentando novamente... (${loop + 1}/${maxLoop})`);
                await this.carregarCotacoes(loop + 1, maxLoop);
            } else {
                console.log(
                    'Máximo de tentativas atingido. Não foi possível carregar as cotações.',
                );
                console.log('BASE_URL:', process.env.BASE_URL);
            }
        }
    }
    adicionarMoedaPadrao() {
        const moedaCodPadrao: Imoedas = {
            Moeda: 'BRL',
            Nome: NOMES_MOEDAS['BRL'],
        };
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
        this.arrayCodMoedas.push(moedaCodPadrao);
    }
    async converterMoeda(valor: string, de: string, para: string): Promise<number> {
        const valorFloat = parseFloat(valor);
        const cotacaoDe = this.cotacoes.find(cotacao => cotacao.Moeda === de);
        const cotacaoPara = this.cotacoes.find(cotacao => cotacao.Moeda === para);

        if (!cotacaoDe || !cotacaoPara) {
            throw new Error('Moeda não encontrada.');
        }
        const taxaMédiaDe =
            (parseFloat(cotacaoDe.TaxaVenda) + parseFloat(cotacaoDe.TaxaCompra)) / 2;
        const taxaMédiaPara =
            (parseFloat(cotacaoPara.TaxaVenda) + parseFloat(cotacaoPara.TaxaCompra)) / 2;
        const cambio = taxaMédiaDe / taxaMédiaPara;

        return valorFloat * cambio;
    }

    async getMoedas(): Promise<Imoedas[]> {
        return this.arrayCodMoedas;
    }

    async getCotacoes(): Promise<ICotacao[]> {
        return this.cotacoes;
    }

    @Cron('0 8 * * *')
    async atualizarCotacoesDiarias() {
        console.log('Iniciando atualização diária de cotações...');
        await this.carregarCotacoes();
        console.log('Cotações atualizadas com sucesso');
    }
}
