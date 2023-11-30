# Algoritmo Genético para Otimização de Pacotes

Este é um projeto Python que utiliza algoritmos genéticos para otimizar a ordem de instalação de pacotes.

## Conteúdo

1. [Descrição](#descrição)
2. [Funcionalidades](#funcionalidades)
3. [Instruções de Uso](#instruções-de-uso)
4. [Configuração do Algoritmo](#configuração-do-algoritmo)
5. [Resultados](#resultados)
6. [Autor](#autor)

---

## Descrição

O projeto consiste em um algoritmo genético para otimizar a ordem de instalação de pacotes, considerando o tempo de instalação de cada pacote e suas dependências.

## Funcionalidades

- Inicializa uma população de soluções aleatórias
- Realiza a seleção de indivíduos para a próxima geração
- Aplica o crossover entre os indivíduos selecionados
- Executa mutação em uma porcentagem dos indivíduos
- Encontra a ordem otimizada de instalação dos pacotes

## Instruções de Uso

Para executar o algoritmo localmente, siga estas instruções:

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
```

2. Execute o arquivo Python que contém o algoritmo. Certifique-se de ter as dependências instaladas.

## Configuração do Algoritmo

- Número de Gerações: 1000
- Tamanho da População: 100
- Número de Pais: 10
- Número de Filhos: 50
- Taxa de Mutação: 0.2

## Resultados

Exemplo de resultado obtido pelo algoritmo:

```
Ordem otimizada dos pacotes:
     Package  Dependencies  Package_Size  Installation_Time
0  Package_1             3            42                 59
3  Package_4             1            30                 30
2  Package_3             4            65                 42
4  Package_5             5            88                 88
1  Package_2             2            37                 37
```

## Autor

Este projeto foi desenvolvido por [Seu Nome](https://github.com/seu-usuario).
