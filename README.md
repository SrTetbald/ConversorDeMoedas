# Conversor de Moedas

Esta é uma api criada para um conversor de moedas, desenvolvido com base nos dados fornecidos pelo Banco Central do Brasil. Ela permite realizar conversões precisas entre diferentes moedas utilizando informações atualizadas.

## Funcionalidades

- Busca informações de cotação de moedas com o Banco central
- Converte valores de difentes moedas usando a moeda BRL como moeda Padrão

## Tecnologias utilizadas

- **Framework:** NestJs
- **Linguagem:** TypeScript
- **Bibliotecas:** axios, csv-parser, date-fns

## Estrutura do Projeto

Abaixo está a estrutura principal do projeto e uma breve descrição de cada pasta/arquivo:

### Descrição das Pastas

- **`src/`**: Contém todo o código-fonte do projeto.
    - **`cotacao/`**: Implementa a lógica de conversão de moedas e comunicação com o módulo externo.
    - **`externo/`**: Responsável por buscar dados externos, como cotações de moedas do Banco Central.
- **`test/`**: Contém os testes automatizados para garantir a qualidade do código.

## Modulos e serviços

### `CotacaoService`

- **Descrição:** Serviço especializado no gerenciamento de cotações de moedas estrangeiras.
- **Principais métodos**
    - `carregarCotacoes(loop: number, maxLoop: number)`: Carrega as taxas de câmbio de um arquivo CSV externo, entregue pelo Banco Central do Brasil (BCB) de uma determinada data, tentando novamente até maxLoop vezes se o carregamento falhar. As taxas carregadas são armazenadas ao array cotacoes.
    - `adicionarMoedaPadrao()`: Adiciona uma moeda padrão o Real (BRL) ao array cotacoes com taxas de câmbio fixas.
    - `converterMoeda(valor: number, de: string, para: string)`:Converte um determinado valor de uma moeda para outra usando as taxas de câmbio carregadas, lançando um erro se as moedas não forem encontradas.
    - `onModuleInit()`: Inicializa o serviço carregando as taxas de câmbio de uma fonte externa usando `carregarCotacoes()` e adicionando uma moeda padrão (BRL) usando `adicionarMoedaPadrao`

### `ExternoService`

- **Descrição:** Serviço para buscar dados externos de um endpoint.
- **Principais métodos:** 
    - `pegarDadosExternos(url: string)`: Faz uma requisição HTTP para buscar e processar dados CSV.

## FIM
