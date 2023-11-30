// Importando a biblioteca lodash
const _ = require('lodash');

// Dados simulados dos pacotes
let package_info = [
    {"Package": "Package_1", "Dependencies": 3, "Package_Size": 42, "Installation_Time": 59},
    {"Package": "Package_2", "Dependencies": 2, "Package_Size": 37, "Installation_Time": 37},
    {"Package": "Package_3", "Dependencies": 4, "Package_Size": 65, "Installation_Time": 42},
    {"Package": "Package_4", "Dependencies": 1, "Package_Size": 30, "Installation_Time": 30},
    {"Package": "Package_5", "Dependencies": 5, "Package_Size": 88, "Installation_Time": 88}
];

// Adicionando mais 45 itens
for (let i = 6; i <= 50; i++) {
    package_info.push({
        "Package": `Package_${i}`,
        "Dependencies": Math.floor(Math.random() * 10), // Aqui você pode ajustar o range para Dependencies
        "Package_Size": Math.floor(Math.random() * 100) + 1, // Aqui você pode ajustar o range para Package_Size
        "Installation_Time": Math.floor(Math.random() * 100) + 1 // Aqui você pode ajustar o range para Installation_Time
    });
}

// Mostrar todas as informações dos pacotes
console.log("Informações completas dos pacotes:");
package_info.forEach(package => {
    //console.log(package);
});

// Função de inicialização da população
function initialize_population(pop_size, num_packages) {
    let population = [];
    for (let i = 0; i < pop_size; i++) {
        let individual = Array.from({length: num_packages}, (_, i) => i);
        individual.sort(() => Math.random() - 0.5);
        population.push(individual);
    }
    return population;
}


// Função para calcular o tempo total de instalação considerando dependências e tamanho do pacote (normalizados)
function calculateObj(sol, package_info) {
    // Verifica se a solução é um array e se não está vazia
    if (!Array.isArray(sol) || sol.length === 0 || !package_info || package_info.length === 0) {
        return -1; // Retorna -1 para representar um estado inválido
    }

    const n = sol.length; // Tamanho da solução
    const m = 2; // Número de máquinas (pode ser ajustado conforme necessário)

    // Verifica se package_info tem as propriedades necessárias
    const hasValidProps = package_info.every(pkg => pkg && pkg.Dependencies !== undefined && pkg.Package_Size !== undefined);

    if (!hasValidProps) {
        return -1; // Retorna -1 para representar um estado inválido
    }
    // Normaliza os dados de dependências e tamanho do pacote
    const maxDependencies = _.maxBy(package_info, 'Dependencies').Dependencies;
    const maxSize = _.maxBy(package_info, 'Package_Size').Package_Size;

    // Calcula um fator de ajuste para as dependências e tamanho do pacote
    const normalizedInfo = package_info.map(pkg => ({
        Dependencies: pkg.Dependencies / maxDependencies,
        Package_Size: pkg.Package_Size / maxSize
    }));

    const qMachines = Array.from({ length: m }, () => []);
    const busyMachines = Array.from({ length: m }, () => false);

    // Matriz de custo
    const cost = [
        [10, 5],
        [7, 8],
        [3, 12],
        [9, 6],
        [5, 10]
    ]; // Substitua por seus próprios custos

    let time = 0;

    // Adiciona os trabalhos à primeira máquina
    for (let i = 0; i < n; i++) {
        if (sol[i] >= 0 && sol[i] < cost.length) {
            qMachines[0].push(sol[i]);
        } else {
            return -1; // Retorna -1 para representar um estado inválido
        }
    }

    let qTime = [];
    // Adiciona os trabalhos à fila de tempo
    for (let i = 0; i < m; i++) {
        if (qMachines[i].length > 0) {
            qTime.push({ time: time + cost[qMachines[i][0]][i], machine: i, job: qMachines[i][0] });
        }
    }

    // Processa os trabalhos
    while (true) {
        if (qTime.length === 0) break;

        qTime.sort((a, b) => a.time - b.time);
        let { time: currentTime, machine, job } = qTime.shift();

        time = currentTime;
        busyMachines[machine] = false;

        // Move o trabalho para a próxima máquina
        if (machine < m - 1) {
            if (!busyMachines[machine + 1]) {
                let nextJob = qMachines[machine].shift();
                if (nextJob !== undefined) {
                    qTime.push({ time: time + cost[nextJob][machine + 1], machine: machine + 1, job: nextJob });
                    busyMachines[machine + 1] = true;
                }
            }
        }

        // Adiciona o próximo trabalho à máquina atual
        let newJob = qMachines[machine].shift();
        if (newJob !== undefined) {
            qTime.push({ time: time + cost[newJob][machine], machine, job: newJob });
            busyMachines[machine] = true;
        }
    }

    return time; // Retorna o tempo total de instalação
}


// Função de seleção dos pais
function selection(pop, num_parents) {
    // Inicializa um array vazio para armazenar os valores objetivos e os índices dos indivíduos
    let popObj = [];
    
    // Loop para calcular o valor objetivo de cada indivíduo na população
    for (let i = 0; i < pop.length; i++) {
        let obj = calculateObj(pop[i]);
        
        // Verifica se o valor objetivo é válido
        if (obj !== -1) {
            // Adiciona o valor objetivo e o índice do indivíduo ao array popObj
            popObj.push([obj, i]);
        }
    }
    
    // Ordena o array popObj em ordem crescente de valor objetivo
    popObj.sort((a, b) => a[0] - b[0]);

    // Inicializa arrays vazios para a distribuição de probabilidade e os índices correspondentes
    let distr = [];
    let distrInd = [];
    
    // Loop para calcular a distribuição de probabilidade
    for (let i = 0; i < popObj.length; i++) {
        // Adiciona o índice do indivíduo ao array distrInd
        distrInd.push(popObj[i][1]);
        
        // Calcula a probabilidade do indivíduo ser selecionado
        let prob = (2 * (i + 1)) / (popObj.length * (popObj.length + 1));
        
        // Adiciona a probabilidade ao array distr
        distr.push(prob);
    }

    // Inicializa um array vazio para os pais
    let parents = [];
    
    // Loop para selecionar os pais
    for (let i = 0; i < num_parents; i++) {
        // Seleciona dois pais de acordo com a distribuição de probabilidade e adiciona-os ao array parents
        parents.push(_.sampleSize(distrInd, 2));
    }

    // Retorna o array de pais
    return parents;
}


// Função de crossover
function crossover(parents, num_offsprings) {
    // Verifica se parents é um array e se tem pelo menos dois elementos
    if (!Array.isArray(parents) || parents.length < 2) {
        // console.log('Erro: parents deve ser um array com pelo menos dois elementos.');
        return [];
    }
    
    // Inicializa um array vazio para os descendentes
    let offsprings = [];
    
    // Loop para criar cada descendente
    for (let i = 0; i < num_offsprings; i++) {
        // Seleciona duas posições aleatórias no array de pais
        let pos = [Math.floor(Math.random() * (parents[0].length - 1)) + 1, Math.floor(Math.random() * (parents[0].length - 1)) + 1];
        
        // Ordena as posições
        pos.sort((a, b) => a - b);

        // Inicializa um array para o descendente
        let child = Array(parents[0].length).fill(-1);
        
        // Copia os genes do primeiro pai para o descendente nas posições selecionadas
        for (let j = pos[0]; j < pos[1]; j++) {
            child[j] = parents[0][j];
        }

        // Copia os genes do segundo pai para o descendente nas posições restantes
        let p = 0;
        for (let j = 0; j < parents[1].length; j++) {
            if (!child.includes(parents[1][j])) {
                while (child[p] !== -1) {
                    p++;
                }
                child[p++] = parents[1][j];
            }
        }
        
        // Adiciona o descendente à lista de descendentes
        offsprings.push(child.filter(value => value !== -1));
    }
    
    // Retorna a lista de descendentes
    return offsprings;
}

// Função de mutação
function mutation(sol, mutation_rate) {
    // Verifica se uma mutação deve ocorrer
    if (Math.random() < mutation_rate) {
        // Seleciona duas posições aleatórias no array sol
        let pos = [Math.floor(Math.random() * sol.length), Math.floor(Math.random() * sol.length)];
        
        // Ordena as posições
        pos.sort((a, b) => a - b);

        // Verifica se as posições são válidas
        if (pos[0] >= 0 && pos[1] >= 0 && pos[0] < sol.length && pos[1] < sol.length) {
            // Remove o gene na segunda posição
            let remJob = sol.splice(pos[1], 1)[0];
            
            // Insere o gene removido na primeira posição
            sol.splice(pos[0], 0, remJob);
        }
    }
}


// Função para atualização elitista da população
function elitistUpdate(oldPop, newPop) {
    // Inicializa o índice e o valor objetivo da melhor solução
    let bestSolInd = 0;
    let bestSol = calculateObj(oldPop[0]);

    // Loop para encontrar a melhor solução na população antiga
    for (let i = 1; i < oldPop.length; i++) {
        let tempObj = calculateObj(oldPop[i]);
        // Se a solução atual é melhor que a melhor solução encontrada até agora
        if (tempObj < bestSol) {
            // Atualiza a melhor solução e seu índice
            bestSol = tempObj;
            bestSolInd = i;
        }
    }

    // Seleciona um índice aleatório na nova população
    let rndInd = Math.floor(Math.random() * newPop.length);
    
    // Substitui o indivíduo no índice aleatório pela melhor solução da população antiga
    newPop[rndInd] = oldPop[bestSolInd];

    // Retorna a nova população
    return newPop;
}

// Função para encontrar a melhor solução da população
function findBestSolution(pop) {
    // Inicializa o valor objetivo e o índice da melhor solução
    let bestObj = calculateObj(pop[0]);
    let bestInd = 0;

    // Loop para encontrar a melhor solução na população
    for (let i = 1; i < pop.length; i++) {
        let tObj = calculateObj(pop[i]);
        // Se a solução atual é melhor que a melhor solução encontrada até agora
        if (tObj < bestObj) {
            // Atualiza a melhor solução e seu índice
            bestObj = tObj;
            bestInd = i;
        }
    }

    // Verifica se a melhor solução é indefinida
    if (pop[bestInd] === undefined) {
        console.log("Undefined population encountered!");
        console.log(pop);
    }

    // Retorna a melhor solução e seu índice e valor objetivo
    return {
        bestInd,
        bestObj,
        bestSolution: pop[bestInd]
    };
}


// Algoritmo genético principal
function genetic_algorithm(num_generations, pop_size, num_parents, num_offsprings, mutation_rate, num_packages, package_info) {
    // Inicializa a população
    let population = initialize_population(pop_size, num_packages);
    
    // Inicializa um array para armazenar as decisões tomadas em cada geração
    let allDecisions = [];

    // Loop para cada geração
    for (let generation = 0; generation < num_generations; generation++) {
        // Seleciona os pais
        let parents = selection(population);
        
        // Realiza o crossover para gerar os descendentes
        let offsprings = crossover(parents, num_offsprings);
        
        // Realiza a mutação nos descendentes
        for (let offspring of offsprings) {
            mutation(offspring, mutation_rate);
        }
        
        // Atualiza a população com a estratégia elitista
        population = elitistUpdate(population, offsprings);

        // Armazena as decisões tomadas nesta geração
        allDecisions.push({ generation: generation + 1, solutions: offsprings });
    }

    // Encontra a melhor solução na população final
    let best_order = findBestSolution(population);
    
    // Mapeia a melhor solução para as informações do pacote
    let optimized_df = best_order.bestSolution.map(index => package_info[index]);
    
    // Converte as informações do pacote para JSON
    let package_info_ordenado = JSON.stringify(optimized_df, null, 4);

    // Retorna a melhor ordem, as decisões tomadas, o dataframe otimizado e as informações do pacote ordenadas
    return { best_order, allDecisions, optimized_df, package_info_ordenado };
}


// Parâmetros do Algoritmo Genético
let num_generations = 100; // Número de gerações
let pop_size = 50; // Tamanho da população
let num_parents = 5; // Número de pais para crossover
let num_offsprings = 50; // Número de filhos gerados
let mutation_rate = 0.5; // Taxa de mutação

// Executando o Algoritmo Genético e armazenando os resultados
let geneticResults = genetic_algorithm(num_generations, pop_size, num_parents, num_offsprings, mutation_rate, package_info.length, package_info);

// Exibindo a ordem otimizada dos pacotes
console.log("Ordem otimizada dos pacotes:");
console.log(geneticResults.optimized_df);

// Exibindo o DataFrame otimizado em JSON
console.log("DataFrame Otimizado em JSON:");
console.log(geneticResults.package_info_ordenado);

// Exibindo todas as decisões tomadas
console.log("Decisões em cada geração:");
console.log(geneticResults.allDecisions);
