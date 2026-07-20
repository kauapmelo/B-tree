/* ---------------------------------------------------------------------
   CONSTANTES DA ÁRVORE (ordem 4)
   --------------------------------------------------------------------- */

var ORDEM = 4;                                   // ordem da árvore: no máximo 4 filhos por nó
var MAXIMO_DE_CHAVES = ORDEM - 1;                // no máximo 3 chaves por nó
var MINIMO_DE_CHAVES = Math.ceil(ORDEM / 2) - 1; // no mínimo 1 chave por nó (exceto a raiz)


/* ---------------------------------------------------------------------
   VARIÁVEL GLOBAL DA ÁRVORE
   A árvore inteira é acessada a partir desta única variável: a raiz.
   Enquanto "raiz" for null, significa que a árvore ainda não foi criada.
   --------------------------------------------------------------------- */

var raiz = null;


/* ---------------------------------------------------------------------
   Cria e devolve um nó novo e vazio.
   ehFolha = true  -> cria um nó folha (vai guardar dados)
   ehFolha = false -> cria um nó interno (só terá separadores)
   --------------------------------------------------------------------- */
function criarNo(ehFolha) {
  return {
    folha: ehFolha,
    chaves: [],
    filhos: [],
    proximo: null
  };
}


/* =====================================================================
   FUNÇÃO: criar()
   Cria uma árvore nova e vazia. Uma árvore vazia é representada por
   uma única folha sem nenhuma chave, que também é a raiz.
   ===================================================================== */
function criar() {
  raiz = criarNo(true); // a árvore vazia é apenas uma folha vazia, que é a raiz
  mostrarMensagem("Árvore criada com sucesso (vazia).");
  imprimir();
}


/* =====================================================================
   FUNÇÃO: destruir()
   Apaga toda a árvore atual e, em seguida, cria uma nova árvore vazia,
   exatamente como pedido no enunciado.
   ===================================================================== */
function destruir() {
  raiz = null;          // remove a referência à árvore antiga (o JavaScript libera a memória sozinho)
  raiz = criarNo(true);  // cria imediatamente uma nova árvore vazia (uma folha vazia)
  mostrarMensagem("Árvore destruída. Uma nova árvore vazia foi criada.");
  imprimir();
}


/* =====================================================================
   FUNÇÃO: buscar(chave)
   Procura uma chave na árvore, descendo da raiz até uma folha e
   informando se a chave foi encontrada ou não.
   ===================================================================== */
function buscar(chave) {
  if (raiz === null) {
    mostrarMensagem("A árvore não existe. Clique em Criar primeiro.");
    return;
  }

  var atual = raiz;

  // Desce pela árvore enquanto o nó atual for um nó interno (separador).
  while (atual.folha === false) {
    // Procura, entre as chaves separadoras, qual filho devemos seguir.
    // Regra: se "chave" for menor que a chave separadora, vai para a
    // esquerda; senão, continua olhando os próximos separadores.
    var i = 0;
    while (i < atual.chaves.length && chave >= atual.chaves[i]) {
      i = i + 1;
    }
    atual = atual.filhos[i];
  }

  // Chegamos a uma folha: agora basta olhar se a chave está na lista.
  if (atual.chaves.indexOf(chave) !== -1) {
    mostrarMensagem("A chave " + chave + " foi ENCONTRADA na árvore.");
  } else {
    mostrarMensagem("A chave " + chave + " NÃO foi encontrada na árvore.");
  }
}


/* =====================================================================
   FUNÇÃO AUXILIAR: encontrarCaminho(chave)
   Desce da raiz até a folha onde "chave" deveria estar, e devolve uma
   lista (um "caminho") com todos os nós visitados, do primeiro (raiz)
   até o último (a folha). Essa lista é usada por inserir() e remover()
   para depois conseguirem voltar e atualizar os nós pais quando
   necessário (sem precisar de recursão).
   ===================================================================== */
function encontrarCaminho(chave) {
  var caminho = [];
  var atual = raiz;

  while (atual.folha === false) {
    caminho.push(atual); // guarda o nó interno visitado
    var i = 0;
    while (i < atual.chaves.length && chave >= atual.chaves[i]) {
      i = i + 1;
    }
    atual = atual.filhos[i];
  }

  caminho.push(atual); // por último, guarda a folha encontrada
  return caminho;
}


/* =====================================================================
   FUNÇÃO AUXILIAR: inserirOrdenado(lista, valor)
   Insere "valor" dentro de "lista" mantendo a lista em ordem crescente.
   ===================================================================== */
function inserirOrdenado(lista, valor) {
  var i = 0;
  while (i < lista.length && lista[i] < valor) {
    i = i + 1;
  }
  lista.splice(i, 0, valor);
}


/* =====================================================================
   FUNÇÃO AUXILIAR: inserirSeparadorNoPai(pai, chave, novoFilho)
   Quando um nó filho se divide (split), uma chave separadora precisa
   "subir" para o nó pai, junto com um ponteiro para o novo nó filho
   que acabou de ser criado. Esta função insere os dois no lugar certo.
   ===================================================================== */
function inserirSeparadorNoPai(pai, chave, novoFilho) {
  var i = 0;
  while (i < pai.chaves.length && chave > pai.chaves[i]) {
    i = i + 1;
  }
  pai.chaves.splice(i, 0, chave);       // insere a chave separadora
  pai.filhos.splice(i + 1, 0, novoFilho); // insere o novo filho logo depois dela
}


/* =====================================================================
   FUNÇÃO: inserir(chave)
   Insere uma nova chave na árvore. Passos:
     1. Desce até a folha correta (usando encontrarCaminho).
     2. Insere a chave nessa folha, em ordem.
     3. Se a folha ultrapassou o limite de 3 chaves, ocorre um OVERFLOW,
        e é preciso fazer um SPLIT (divisão), o que pode se repetir
        subindo pela árvore (tratado pela função tratarOverflow).
   ===================================================================== */
function inserir(chave) {
  if (raiz === null) {
    mostrarMensagem("A árvore não existe. Clique em Criar primeiro.");
    return;
  }

  var caminho = encontrarCaminho(chave);
  var folha = caminho[caminho.length - 1];

  // Esta árvore não permite chaves repetidas.
  if (folha.chaves.indexOf(chave) !== -1) {
    mostrarMensagem("A chave " + chave + " já existe na árvore.");
    return;
  }

  // Insere a chave na folha correta, em ordem crescente.
  inserirOrdenado(folha.chaves, chave);

  // Se a folha passou de 3 chaves (ficou com 4), houve OVERFLOW.
  if (folha.chaves.length > MAXIMO_DE_CHAVES) {
    tratarOverflow(caminho);
  }

  mostrarMensagem("Chave " + chave + " inserida com sucesso.");
  imprimir();
}


/* =====================================================================
   FUNÇÃO: tratarOverflow(caminho)
   Trata o "estouro" (overflow) de um nó que ficou com chaves demais
   (mais que MAXIMO_DE_CHAVES). A solução é fazer um SPLIT: dividir o
   nó em dois e mandar uma chave separadora para o nó pai. Isso pode
   fazer o pai também estourar, então o processo sobe nível por nível
   (por isso usamos um laço "while", em vez de uma função recursiva).
   ===================================================================== */
function tratarOverflow(caminho) {
  var indice = caminho.length - 1; // começa no último nó do caminho (a folha)

  while (indice >= 0) {
    var no = caminho[indice];

    // Se o nó não estourou, não há mais nada a fazer: paramos aqui.
    if (no.chaves.length <= MAXIMO_DE_CHAVES) {
      break;
    }

    if (no.folha === true) {
      /* ---------- SPLIT DE UMA FOLHA ---------- *
       * Como é uma Árvore B+, ao dividir uma folha nós COPIAMOS a
       * primeira chave da metade direita para cima (ela continua
       * também guardada na folha, pois é ali que os dados realmente
       * moram). As folhas continuam ligadas em lista (proximo). */

      var novaFolha = criarNo(true);
      var meio = Math.ceil(no.chaves.length / 2);

      novaFolha.chaves = no.chaves.slice(meio);  // metade direita vai para a nova folha
      no.chaves = no.chaves.slice(0, meio);       // metade esquerda fica no nó original

      // Atualiza a lista ligada de folhas: novaFolha entra entre "no" e quem vinha depois dele.
      novaFolha.proximo = no.proximo;
      no.proximo = novaFolha;

      var chaveSeparadora = novaFolha.chaves[0]; // primeira chave da folha da direita (é uma CÓPIA)

      if (indice === 0) {
        // A folha que dividiu era a raiz: criamos uma nova raiz interna com 2 filhos.
        var novaRaiz = criarNo(false);
        novaRaiz.chaves = [chaveSeparadora];
        novaRaiz.filhos = [no, novaFolha];
        raiz = novaRaiz;
        break; // chegamos ao topo da árvore, terminamos
      } else {
        // Envia a chave separadora e o ponteiro da nova folha para o nó pai.
        var pai = caminho[indice - 1];
        inserirSeparadorNoPai(pai, chaveSeparadora, novaFolha);
      }

    } else {
      /* ---------- SPLIT DE UM NÓ INTERNO ---------- *
       * Diferente da folha, aqui a chave do meio SOBE E É REMOVIDA do
       * nó (ela não fica duplicada), pois nós internos só existem
       * para guiar buscas, e não guardam dados de verdade. */

      var meioInterno = Math.floor(no.chaves.length / 2);
      var chaveQueSobe = no.chaves[meioInterno];

      var novoNoInterno = criarNo(false);
      novoNoInterno.chaves = no.chaves.slice(meioInterno + 1); // chaves à direita da que subiu
      novoNoInterno.filhos = no.filhos.slice(meioInterno + 1); // filhos correspondentes à direita

      no.chaves = no.chaves.slice(0, meioInterno);        // chaves à esquerda da que subiu
      no.filhos = no.filhos.slice(0, meioInterno + 1);     // filhos correspondentes à esquerda

      if (indice === 0) {
        // O nó interno que dividiu era a raiz: cria uma nova raiz acima dele.
        var novaRaizInterna = criarNo(false);
        novaRaizInterna.chaves = [chaveQueSobe];
        novaRaizInterna.filhos = [no, novoNoInterno];
        raiz = novaRaizInterna;
        break;
      } else {
        var paiInterno = caminho[indice - 1];
        inserirSeparadorNoPai(paiInterno, chaveQueSobe, novoNoInterno);
      }
    }

    indice = indice - 1; // sobe um nível para conferir se o pai também estourou
  }
}


/* =====================================================================
   FUNÇÃO: remover(chave)
   Remove uma chave da árvore. Passos:
     1. Desce até a folha onde a chave deveria estar.
     2. Se não encontrar a chave, avisa e para.
     3. Remove a chave da folha.
     4. Se a folha ficou com menos chaves que o mínimo permitido, ocorre
        um UNDERFLOW, tratado com REDISTRIBUIÇÃO (pegar emprestado de
        um irmão) ou, se não for possível, com MERGE (juntar com um
        irmão), que pode se repetir subindo pela árvore.
   ===================================================================== */
function remover(chave) {
  if (raiz === null) {
    mostrarMensagem("A árvore não existe. Clique em Criar primeiro.");
    return;
  }

  var caminho = encontrarCaminho(chave);
  var folha = caminho[caminho.length - 1];
  var posicao = folha.chaves.indexOf(chave);

  if (posicao === -1) {
    mostrarMensagem("A chave " + chave + " não foi encontrada na árvore.");
    return;
  }

  folha.chaves.splice(posicao, 1); // remove a chave da folha

  tratarUnderflow(caminho); // verifica e corrige eventual underflow, subindo se preciso

  mostrarMensagem("Chave " + chave + " removida com sucesso.");
  imprimir();
}


/* =====================================================================
   FUNÇÃO: tratarUnderflow(caminho)
   Trata o "esvaziamento" (underflow) de um nó que ficou com menos
   chaves do que o mínimo permitido (MINIMO_DE_CHAVES). A raiz nunca
   sofre underflow (ela não tem mínimo obrigatório), por isso o laço
   para antes de chegar nela (índice > 0).

   Para cada nó com underflow, tentamos, nesta ordem:
     1) REDISTRIBUIÇÃO com o irmão esquerdo (se ele tiver "sobrando").
     2) REDISTRIBUIÇÃO com o irmão direito (se ele tiver "sobrando").
     3) MERGE (juntar) com um dos irmãos, o que remove um separador
        do nó pai e pode fazer o PAI também sofrer underflow — por
        isso o laço continua subindo até a raiz, se necessário.
   ===================================================================== */
function tratarUnderflow(caminho) {
  var indice = caminho.length - 1;

  while (indice > 0) { // a raiz (índice 0) nunca precisa desse tratamento
    var no = caminho[indice];

    // Se o nó ainda tem chaves suficientes, não há underflow: paramos.
    if (no.chaves.length >= MINIMO_DE_CHAVES) {
      break;
    }

    var pai = caminho[indice - 1];
    var posicaoNoPai = pai.filhos.indexOf(no);

    var irmaoEsquerdo = (posicaoNoPai > 0) ? pai.filhos[posicaoNoPai - 1] : null;
    var irmaoDireito = (posicaoNoPai < pai.filhos.length - 1) ? pai.filhos[posicaoNoPai + 1] : null;

    if (no.folha === true) {

      /* ---------- CASO 1: nó é uma FOLHA ---------- */

      if (irmaoEsquerdo !== null && irmaoEsquerdo.chaves.length > MINIMO_DE_CHAVES) {
        // REDISTRIBUIÇÃO: o irmão esquerdo empresta sua última chave.
        var chaveEmprestadaEsq = irmaoEsquerdo.chaves.pop();
        no.chaves.unshift(chaveEmprestadaEsq);
        pai.chaves[posicaoNoPai - 1] = no.chaves[0]; // atualiza o separador no pai
        break; // problema resolvido, não precisa subir mais

      } else if (irmaoDireito !== null && irmaoDireito.chaves.length > MINIMO_DE_CHAVES) {
        // REDISTRIBUIÇÃO: o irmão direito empresta sua primeira chave.
        var chaveEmprestadaDir = irmaoDireito.chaves.shift();
        no.chaves.push(chaveEmprestadaDir);
        pai.chaves[posicaoNoPai] = irmaoDireito.chaves[0]; // atualiza o separador no pai
        break;

      } else if (irmaoEsquerdo !== null) {
        // MERGE com o irmão esquerdo: junta as chaves de "no" dentro dele.
        irmaoEsquerdo.chaves = irmaoEsquerdo.chaves.concat(no.chaves);
        irmaoEsquerdo.proximo = no.proximo;             // corrige a lista ligada de folhas
        pai.chaves.splice(posicaoNoPai - 1, 1);          // remove o separador que sobrou
        pai.filhos.splice(posicaoNoPai, 1);              // remove o filho "no", que foi absorvido

      } else {
        // MERGE com o irmão direito: junta as chaves dele dentro de "no".
        no.chaves = no.chaves.concat(irmaoDireito.chaves);
        no.proximo = irmaoDireito.proximo;               // corrige a lista ligada de folhas
        pai.chaves.splice(posicaoNoPai, 1);              // remove o separador que sobrou
        pai.filhos.splice(posicaoNoPai + 1, 1);          // remove o irmão direito, que foi absorvido
      }

    } else {

      /* ---------- CASO 2: nó é INTERNO ---------- */

      if (irmaoEsquerdo !== null && irmaoEsquerdo.chaves.length > MINIMO_DE_CHAVES) {
        // REDISTRIBUIÇÃO: o separador do pai desce para "no", e a
        // última chave do irmão esquerdo sobe para o lugar do pai.
        no.chaves.unshift(pai.chaves[posicaoNoPai - 1]);
        pai.chaves[posicaoNoPai - 1] = irmaoEsquerdo.chaves.pop();
        no.filhos.unshift(irmaoEsquerdo.filhos.pop()); // o filho correspondente também se move
        break;

      } else if (irmaoDireito !== null && irmaoDireito.chaves.length > MINIMO_DE_CHAVES) {
        // REDISTRIBUIÇÃO: o separador do pai desce para "no", e a
        // primeira chave do irmão direito sobe para o lugar do pai.
        no.chaves.push(pai.chaves[posicaoNoPai]);
        pai.chaves[posicaoNoPai] = irmaoDireito.chaves.shift();
        no.filhos.push(irmaoDireito.filhos.shift());
        break;

      } else if (irmaoEsquerdo !== null) {
        // MERGE com o irmão esquerdo: o separador do pai desce e vira
        // uma chave normal dentro do nó juntado.
        irmaoEsquerdo.chaves.push(pai.chaves[posicaoNoPai - 1]);
        irmaoEsquerdo.chaves = irmaoEsquerdo.chaves.concat(no.chaves);
        irmaoEsquerdo.filhos = irmaoEsquerdo.filhos.concat(no.filhos);
        pai.chaves.splice(posicaoNoPai - 1, 1);
        pai.filhos.splice(posicaoNoPai, 1);

      } else {
        // MERGE com o irmão direito: mesma ideia, para o outro lado.
        no.chaves.push(pai.chaves[posicaoNoPai]);
        no.chaves = no.chaves.concat(irmaoDireito.chaves);
        no.filhos = no.filhos.concat(irmaoDireito.filhos);
        pai.chaves.splice(posicaoNoPai, 1);
        pai.filhos.splice(posicaoNoPai + 1, 1);
      }
    }

    // Depois de um MERGE, o nó pai perdeu uma chave e um filho, o que
    // pode ter causado underflow nele também: subimos um nível para
    // conferir isso na próxima volta do laço.
    indice = indice - 1;
  }

  // Caso especial: se a raiz é um nó interno e ficou sem nenhuma
  // chave (sobrou só 1 filho, por causa de um merge), esse filho
  // único passa a ser a nova raiz da árvore.
  if (raiz.folha === false && raiz.chaves.length === 0) {
    raiz = raiz.filhos[0];
  }
}


/* =====================================================================
   FUNÇÃO: imprimir()
   Mostra a árvore inteira na tela, organizada por níveis (percurso em
   largura, também chamado de "busca em largura" ou BFS), usando
   apenas divs de HTML — uma linha por nível, uma caixa por nó.
   ===================================================================== */
function imprimir() {
  var areaArvore = document.getElementById("area-arvore");
  areaArvore.innerHTML = ""; // limpa o desenho anterior

  if (raiz === null) {
    areaArvore.innerHTML = "<p>A árvore ainda não foi criada.</p>";
    return;
  }

  // Monta uma lista de níveis. Cada nível é uma lista dos nós que
  // ficam naquela altura da árvore (nível 0 = raiz, nível 1 = filhos
  // da raiz, e assim por diante).
  var niveis = [];
  var nivelAtual = [raiz];

  while (nivelAtual.length > 0) {
    niveis.push(nivelAtual);

    var proximoNivel = [];
    for (var i = 0; i < nivelAtual.length; i = i + 1) {
      var no = nivelAtual[i];
      if (no.folha === false) {
        for (var j = 0; j < no.filhos.length; j = j + 1) {
          proximoNivel.push(no.filhos[j]);
        }
      }
    }
    nivelAtual = proximoNivel;
  }

  // Agora desenha cada nível como uma linha de caixas (divs).
  for (var n = 0; n < niveis.length; n = n + 1) {
    var linhaDiv = document.createElement("div");
    linhaDiv.className = "linha-nivel";

    for (var k = 0; k < niveis[n].length; k = k + 1) {
      var noAtual = niveis[n][k];
      var noDiv = document.createElement("div");
      noDiv.className = (noAtual.folha === true) ? "no-folha" : "no-interno";
      noDiv.textContent = "[ " + noAtual.chaves.join(" , ") + " ]";
      linhaDiv.appendChild(noDiv);
    }

    areaArvore.appendChild(linhaDiv);
  }
}


/* =====================================================================
   FUNÇÕES DE INTERFACE
   Fazem a ligação entre os botões da tela (index.html) e as funções
   da árvore explicadas acima.
   ===================================================================== */

// Mostra um texto na área de mensagens da tela.
function mostrarMensagem(texto) {
  var areaMensagens = document.getElementById("area-mensagens");
  areaMensagens.textContent = texto;
}

// Lê o número digitado no campo de texto. Devolve NaN se o campo
// estiver vazio ou não for um número válido.
function obterChaveDigitada() {
  var campo = document.getElementById("campo-chave");
  return parseInt(campo.value, 10);
}

function botaoCriar() {
  criar();
}

function botaoInserir() {
  var chave = obterChaveDigitada();
  if (isNaN(chave)) {
    mostrarMensagem("Digite um número válido antes de inserir.");
    return;
  }
  inserir(chave);
}

function botaoBuscar() {
  var chave = obterChaveDigitada();
  if (isNaN(chave)) {
    mostrarMensagem("Digite um número válido antes de buscar.");
    return;
  }
  buscar(chave);
}

function botaoRemover() {
  var chave = obterChaveDigitada();
  if (isNaN(chave)) {
    mostrarMensagem("Digite um número válido antes de remover.");
    return;
  }
  remover(chave);
}

function botaoImprimir() {
  imprimir();
  mostrarMensagem("Árvore impressa por níveis.");
}

function botaoDestruir() {
  destruir();
}


/* =====================================================================
   DEMONSTRAÇÃO AUTOMÁTICA

   Executa, passo a passo e com uma pequena pausa entre cada passo,
   exatamente a sequência de operações pedida como exemplo:

     criar()
     inserir(10), inserir(20), inserir(30)  -> preenchem a primeira folha
     inserir(40)                            -> causa OVERFLOW e SPLIT da folha
     inserir(50), inserir(60)               -> inserir(60) causa novo SPLIT
     buscar(40)                             -> demonstra uma busca
     remover(30)                            -> demonstra uma remoção
     imprimir()                             -> mostra o estado final por níveis
     destruir()                             -> apaga tudo e cria uma árvore nova

   A cada passo, a árvore desenhada na tela é atualizada, para que o
   aluno possa acompanhar visualmente cada mudança na estrutura.
   ===================================================================== */
function rodarDemonstracao() {
  var passos = [
    function () { criar(); },
    function () { inserir(10); },
    function () { inserir(20); },
    function () { inserir(30); },
    function () { inserir(40); }, // aqui acontece o primeiro overflow + split
    function () { inserir(50); },
    function () { inserir(60); }, // aqui acontece outro overflow + split
    function () { buscar(40); },
    function () { remover(30); },
    function () { imprimir(); },
    function () { destruir(); }
  ];

  var indicePasso = 0;

  function executarProximoPasso() {
    if (indicePasso < passos.length) {
      passos[indicePasso](); // executa a operação deste passo
      indicePasso = indicePasso + 1;
      setTimeout(executarProximoPasso, 1400); // espera 1.4s e segue para o próximo passo
    }
  }

  executarProximoPasso();
}