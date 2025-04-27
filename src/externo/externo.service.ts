import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as csv from 'csv-parser';
import { Readable } from 'stream';


@Injectable()
export class ExternoService {
    async pegarDadosExternos(url: string): Promise<any[]> {
        try{
            const response = await axios.get(url, {responseType: 'stream'});
            const results: any[] = [];
            const headers = ['Data', 'CodMoeda', 'Tipo', 'Moeda', 'TaxaCompra', 'TaxaVenda', 'ParidadeCompra', 'ParidadeVenda'];

            return new Promise((resolve, reject) => {
                (response.data as Readable)
                  .pipe(csv({separator: ';', headers: false}))
                  .on('data', (row) => {
                    const formattedRow: any = {};
                    for (let i = 0; i < headers.length; i++) {
                      formattedRow[headers[i]] = row[i];
                    }
                    results.push(formattedRow);
                  })
                  .on('end', () => resolve(results))
                  .on('error', (error) => {
                    console.error('Erro ao analisar CSV:', error);
                    reject(new Error('Falha ao analisar CSV.'));
                  });
              });
        }catch (error) {
            console.error('Erro ao pegar dados externos:', error);
            throw new Error('Falha ao pegar dados externos.');
        }
    }
}
