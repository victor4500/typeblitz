/**
 * data/codeSnippets.js
 *
 * Trechos de código para o modo "Code Typing".
 * Cada trecho tem:
 *   - code:    o código a ser digitado
 *   - title:   nome do conceito
 *   - explain: explicação didática em português do que aquele código faz
 *
 * Linguagens: python, javascript, html, java, c
 * Dificuldades: simple | medium
 */

export const CODE_SNIPPETS = {

  /* ════════════════ PYTHON ════════════════ */
  python: {
    simple: [
      {
        code: `def soma(a, b):\n    return a + b\n\nresultado = soma(10, 20)\nprint(resultado)`,
        title: "Função simples",
        explain: "Define uma função chamada 'soma' que recebe dois números e devolve a soma. Depois chama com 10 e 20, guarda o resultado e imprime na tela.",
      },
      {
        code: `numeros = [1, 2, 3, 4, 5]\nfor n in numeros:\n    print(n * 2)`,
        title: "Loop em lista",
        explain: "Cria uma lista com os números de 1 a 5. O 'for' percorre cada número e imprime o dobro de cada um.",
      },
      {
        code: `nome = input("Seu nome: ")\nprint(f"Ola, {nome}!")`,
        title: "Entrada do usuário",
        explain: "Pede para o usuário digitar o nome no terminal. A f-string monta a frase inserindo o nome dentro de {}.",
      },
      {
        code: `quadrados = [x**2 for x in range(10)]\nprint(quadrados)`,
        title: "List comprehension",
        explain: "Cria uma lista com o quadrado de cada número de 0 a 9, tudo em uma linha. Jeito compacto e elegante de criar listas em Python.",
      },
      {
        code: `def par(n):\n    return n % 2 == 0\n\nfor i in range(10):\n    print(i, par(i))`,
        title: "Verificar número par",
        explain: "A função 'par' usa o operador % (resto da divisão). Se o resto de dividir por 2 for zero, é par. O loop testa de 0 a 9.",
      },
    ],
    medium: [
      {
        code: `import json\n\ndef carregar(caminho):\n    with open(caminho, "r") as f:\n        return json.load(f)\n\nconfig = carregar("config.json")\nprint(config.get("host", "localhost"))`,
        title: "Lendo arquivo JSON",
        explain: "Importa o módulo json. A função abre um arquivo, lê como JSON e retorna um dicionário. O .get() busca a chave 'host' e usa 'localhost' como padrão se não encontrar.",
      },
      {
        code: `from dataclasses import dataclass\n\n@dataclass\nclass Usuario:\n    nome: str\n    idade: int\n    email: str\n\nu = Usuario("Ana", 28, "ana@email.com")\nprint(u)`,
        title: "Dataclass",
        explain: "Dataclass é um jeito rápido de criar classes para guardar dados. O decorador @dataclass gera automaticamente o __init__ e o __repr__, poupando código repetitivo.",
      },
      {
        code: `import asyncio\n\nasync def buscar(url):\n    await asyncio.sleep(1)\n    return f"Dados de {url}"\n\nasync def main():\n    resultado = await buscar("api.exemplo.com")\n    print(resultado)\n\nasyncio.run(main())`,
        title: "Programação assíncrona",
        explain: "Funções 'async' podem ser pausadas com 'await' sem bloquear o programa. asyncio.sleep simula espera de rede. asyncio.run() inicia o loop de eventos.",
      },
      {
        code: `def memoizar(fn):\n    cache = {}\n    def wrapper(*args):\n        if args not in cache:\n            cache[args] = fn(*args)\n        return cache[args]\n    return wrapper\n\n@memoizar\ndef fib(n):\n    return n if n < 2 else fib(n-1) + fib(n-2)`,
        title: "Memoização",
        explain: "Guarda resultados já calculados num dicionário (cache). Se a função for chamada com os mesmos argumentos, retorna instantaneamente sem recalcular. Drástico em funções recursivas.",
      },
    ],
  },

  /* ════════════════ JAVASCRIPT ════════════════ */
  javascript: {
    simple: [
      {
        code: `const somar = (a, b) => a + b;\nconsole.log(somar(5, 3));`,
        title: "Arrow function",
        explain: "Arrow functions são uma forma curta de escrever funções. O '=>' separa parâmetros do corpo. Se for uma só expressão, o return é implícito.",
      },
      {
        code: `const numeros = [1, 2, 3, 4, 5];\nconst dobros = numeros.map(x => x * 2);\nconsole.log(dobros);`,
        title: "Array.map()",
        explain: ".map() cria um novo array aplicando uma função em cada elemento. Aqui cada número é multiplicado por 2. O array original não é modificado.",
      },
      {
        code: `fetch('/api/usuarios')\n  .then(res => res.json())\n  .then(dados => console.log(dados));`,
        title: "Fetch API com Promises",
        explain: "fetch() faz requisição HTTP. Retorna uma Promise. Com .then() você encadeia ações: converte para JSON e usa os dados. Forma padrão de consumir APIs no navegador.",
      },
      {
        code: `const obj = { nome: "Alice", idade: 30 };\nconst { nome, idade } = obj;\nconsole.log(\`\${nome} tem \${idade} anos\`);`,
        title: "Destructuring e template string",
        explain: "Destructuring extrai propriedades de um objeto em variáveis. Template strings (backtick) permitem inserir variáveis com ${}.",
      },
      {
        code: `const esperar = ms => new Promise(r => setTimeout(r, ms));\nawait esperar(1000);\nconsole.log("Pronto!");`,
        title: "Promise com timer",
        explain: "Cria uma função que pausa a execução por 'ms' milissegundos. O await espera a Promise resolver. Útil para criar delays ou simular requisições lentas.",
      },
    ],
    medium: [
      {
        code: `async function buscarDados(url) {\n  try {\n    const res = await fetch(url);\n    const dados = await res.json();\n    return dados;\n  } catch (erro) {\n    console.error(erro);\n    return null;\n  }\n}`,
        title: "Async/Await com try-catch",
        explain: "Async/Await torna código assíncrono mais legível. O try-catch captura erros de rede. Se falhar, loga o erro e retorna null em vez de travar o programa.",
      },
      {
        code: `class Emissor {\n  constructor() {\n    this.eventos = {};\n  }\n  on(evento, fn) {\n    (this.eventos[evento] ??= []).push(fn);\n  }\n  emitir(evento, ...args) {\n    this.eventos[evento]?.forEach(fn => fn(...args));\n  }\n}`,
        title: "Event Emitter (padrão Observer)",
        explain: "Objetos se inscrevem em eventos com .on() e são notificados com .emitir(). É a base de sistemas como Node.js Events e frameworks reativos.",
      },
      {
        code: `const debounce = (fn, delay) => {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n};`,
        title: "Debounce",
        explain: "Garante que a função só execute depois que o usuário parar de acionar por 'delay' ms. Clássico em campos de busca: evita chamar a API a cada letra digitada.",
      },
    ],
  },

  /* ════════════════ HTML/CSS ════════════════ */
  html: {
    simple: [
      {
        code: `<div class="cartao">\n  <h2>Titulo</h2>\n  <p>Conteudo do cartao aqui</p>\n  <button class="btn">Clique aqui</button>\n</div>`,
        title: "Estrutura de cartão HTML",
        explain: "'div' é um contêiner genérico. 'h2' é título de segundo nível, 'p' é parágrafo e 'button' é clicável. Classes são usadas para estilizar com CSS.",
      },
      {
        code: `<form method="POST" action="/enviar">\n  <input type="text" name="nome" placeholder="Seu nome">\n  <input type="email" name="email">\n  <button type="submit">Enviar</button>\n</form>`,
        title: "Formulário HTML",
        explain: "O form define destino (action) e método de envio (POST). Cada input coleta um tipo de dado. O botão submit envia o formulário ao servidor.",
      },
      {
        code: `<ul class="lista">\n  <li>Primeiro item</li>\n  <li>Segundo item</li>\n  <li>Terceiro item</li>\n</ul>`,
        title: "Lista não-ordenada",
        explain: "'ul' cria lista com marcadores. Cada 'li' é um item. Use 'ol' quando a ordem importar (lista numerada). Listas são elementos semânticos fundamentais do HTML.",
      },
      {
        code: `<nav class="navbar">\n  <a href="/" class="logo">Marca</a>\n  <ul>\n    <li><a href="/sobre">Sobre</a></li>\n    <li><a href="/contato">Contato</a></li>\n  </ul>\n</nav>`,
        title: "Barra de navegação semântica",
        explain: "A tag 'nav' indica semanticamente área de navegação. Tags semânticas (nav, header, footer, main) ajudam acessibilidade e SEO, além de tornar o HTML mais legível.",
      },
    ],
    medium: [
      {
        code: `.container {\n  display: flex;\n  gap: 1rem;\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 1.5rem;\n}\n\n.cartao {\n  border-radius: 12px;\n  background: #fff;\n  box-shadow: 0 4px 24px rgba(0,0,0,0.1);\n  padding: 1.5rem;\n}`,
        title: "Flexbox e estilos de cartão",
        explain: "Flexbox alinha filhos em linha com 'display: flex'. 'gap' define espaço entre eles. 'margin: 0 auto' centraliza o container. border-radius arredonda e box-shadow cria sombra.",
      },
      {
        code: `@keyframes entrar {\n  from {\n    opacity: 0;\n    transform: translateY(-20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n.modal {\n  animation: entrar 0.3s ease;\n}`,
        title: "Animação com @keyframes",
        explain: "@keyframes define os quadros da animação entre 'from' e 'to'. 'opacity' controla transparência. 'translateY' move verticalmente. 'animation' aplica e define duração e timing.",
      },
      {
        code: `:root {\n  --primario: #7c5cfc;\n  --fundo: #0a0a0f;\n  --texto: #e8e8f0;\n}\n\n.btn {\n  background: var(--primario);\n  color: #fff;\n  border-radius: 8px;\n  padding: 0.6rem 1.4rem;\n  border: none;\n  cursor: pointer;\n}`,
        title: "Variáveis CSS (custom properties)",
        explain: "Variáveis em ':root' ficam disponíveis em todo o CSS. Use 'var(--nome)' para reutilizar. Facilita criar temas e manter consistência. Muito melhor que repetir cores em vários lugares.",
      },
    ],
  },

  /* ════════════════ JAVA ════════════════ */
  java: {
    simple: [
      {
        code: `public class OlaMundo {\n    public static void main(String[] args) {\n        System.out.println("Ola, Mundo!");\n    }\n}`,
        title: "Hello World em Java",
        explain: "Todo programa Java começa pela classe pública com mesmo nome do arquivo. O método 'main' é o ponto de entrada. System.out.println imprime com quebra de linha no final.",
      },
      {
        code: `int soma = 0;\nfor (int i = 1; i <= 10; i++) {\n    soma += i;\n}\nSystem.out.println("Soma: " + soma);`,
        title: "Loop for e acumulador",
        explain: "O for tem: inicialização (int i=1), condição (i<=10) e incremento (i++). 'soma += i' é atalho para soma = soma + i. O + no println concatena texto e número.",
      },
      {
        code: `String nome = "Maria";\nint idade = 25;\nSystem.out.println("Nome: " + nome);\nSystem.out.println("Idade: " + idade);`,
        title: "Variáveis tipadas",
        explain: "Java é fortemente tipado: você declara o tipo da variável (String, int, double...). String é classe (maiúsculo), int é tipo primitivo. O compilador verifica os tipos em tempo de compilação.",
      },
      {
        code: `public static int fatorial(int n) {\n    if (n <= 1) return 1;\n    return n * fatorial(n - 1);\n}`,
        title: "Recursão em Java",
        explain: "Recursão é quando uma função chama a si mesma. O caso base (n<=1 retorna 1) evita loop infinito. Fatorial de 5 = 5×4×3×2×1 = 120. Java exige declarar o tipo de retorno.",
      },
      {
        code: `int[] numeros = {3, 1, 4, 1, 5, 9};\nfor (int n : numeros) {\n    System.out.println(n);\n}`,
        title: "Array e for-each",
        explain: "Arrays em Java têm tamanho fixo e tipo definido. O for-each (for tipo variavel : array) é a forma mais limpa de percorrer todos os elementos sem precisar de índice.",
      },
    ],
    medium: [
      {
        code: `import java.util.ArrayList;\nimport java.util.List;\n\nList<String> nomes = new ArrayList<>();\nnomes.add("Ana");\nnomes.add("Bruno");\nnomes.add("Carlos");\n\nfor (String nome : nomes) {\n    System.out.println(nome);\n}`,
        title: "ArrayList e Generics",
        explain: "ArrayList é um array dinâmico que cresce conforme você adiciona. O <String> é um Generic: garante que só Strings entrem. 'List' é a interface, 'ArrayList' é a implementação concreta.",
      },
      {
        code: `public class Conta {\n    private double saldo;\n\n    public Conta(double saldoInicial) {\n        this.saldo = saldoInicial;\n    }\n\n    public void depositar(double valor) {\n        saldo += valor;\n    }\n\n    public double getSaldo() {\n        return saldo;\n    }\n}`,
        title: "Encapsulamento",
        explain: "'private' protege o saldo de acesso externo direto. O construtor inicializa o objeto. Métodos públicos controlam como o saldo é acessado — isso é encapsulamento, pilar da Orientação a Objetos.",
      },
      {
        code: `try {\n    int resultado = 10 / 0;\n    System.out.println(resultado);\n} catch (ArithmeticException e) {\n    System.out.println("Erro: " + e.getMessage());\n} finally {\n    System.out.println("Sempre executa");\n}`,
        title: "Tratamento de exceções",
        explain: "try executa código perigoso. catch captura o erro específico (dividir por zero lança ArithmeticException). finally sempre executa, com ou sem erro — ideal para fechar arquivos e conexões.",
      },
      {
        code: `import java.util.Arrays;\nimport java.util.List;\nimport java.util.stream.Collectors;\n\nList<Integer> nums = Arrays.asList(1,2,3,4,5,6);\nList<Integer> pares = nums.stream()\n    .filter(n -> n % 2 == 0)\n    .collect(Collectors.toList());\nSystem.out.println(pares);`,
        title: "Streams e Lambda (Java 8+)",
        explain: "Streams processam coleções de forma funcional. filter() com lambda (n -> ...) filtra elementos. collect() materializa o resultado. Introduzido no Java 8, elimina muito código verboso.",
      },
    ],
  },

  /* ════════════════ C ════════════════ */
  c: {
    simple: [
      {
        code: `#include <stdio.h>\n\nint main() {\n    printf("Ola, Mundo!\\n");\n    return 0;\n}`,
        title: "Hello World em C",
        explain: "#include importa a biblioteca de entrada/saída. 'main' é onde o programa começa. printf imprime texto. '\\n' é a quebra de linha. 'return 0' indica que o programa terminou sem erros.",
      },
      {
        code: `int soma = 0;\nfor (int i = 1; i <= 10; i++) {\n    soma += i;\n}\nprintf("Soma: %d\\n", soma);`,
        title: "Loop e printf formatado",
        explain: "printf usa especificadores: %d para inteiro, %f para float, %s para string. O '\\n' quebra a linha. O loop acumula a soma de 1 a 10 na variável 'soma'.",
      },
      {
        code: `int a = 5, b = 3;\nint maior = (a > b) ? a : b;\nprintf("Maior: %d\\n", maior);`,
        title: "Operador ternário",
        explain: "O operador ternário (condição ? valorSeSim : valorSeNao) é um if em uma linha. Em C, comparações retornam 1 (verdadeiro) ou 0 (falso). Aqui retorna o maior entre a e b.",
      },
      {
        code: `int fatorial(int n) {\n    if (n <= 1) return 1;\n    return n * fatorial(n - 1);\n}\n\nint main() {\n    printf("%d\\n", fatorial(5));\n    return 0;\n}`,
        title: "Função recursiva",
        explain: "Em C, funções devem ser declaradas antes de serem usadas. A recursão reduz o problema a cada chamada até o caso base (n<=1). Você deve sempre declarar o tipo de retorno.",
      },
      {
        code: `char nome[50];\nprintf("Digite seu nome: ");\nscanf("%s", nome);\nprintf("Ola, %s!\\n", nome);`,
        title: "Entrada com scanf",
        explain: "Em C, strings são arrays de char com tamanho fixo que você reserva. scanf lê do teclado com %s. É mais baixo nível — você gerencia o espaço de memória manualmente.",
      },
    ],
    medium: [
      {
        code: `#include <stdio.h>\n\nvoid trocar(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int x = 10, y = 20;\n    trocar(&x, &y);\n    printf("x=%d y=%d\\n", x, y);\n    return 0;\n}`,
        title: "Ponteiros e passagem por referência",
        explain: "Ponteiros guardam o endereço de memória de uma variável. '*a' acessa o valor naquele endereço. '&x' passa o endereço de x. Assim a função modifica a variável original — conceito fundamental em C.",
      },
      {
        code: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char texto[] = "hello world";\n    int tam = strlen(texto);\n    printf("Tamanho: %d\\n", tam);\n    texto[0] = 'H';\n    printf("%s\\n", texto);\n    return 0;\n}`,
        title: "Strings e string.h",
        explain: "Strings em C são arrays de char terminados com '\\0'. strlen conta os caracteres. Você modifica caracteres pelo índice. string.h oferece funções como strlen, strcpy, strcmp.",
      },
      {
        code: `#include <stdio.h>\n\nstruct Pessoa {\n    char nome[50];\n    int idade;\n    float altura;\n};\n\nint main() {\n    struct Pessoa p = {\"Carlos\", 30, 1.75};\n    printf(\"%s tem %d anos\\n\", p.nome, p.idade);\n    return 0;\n}`,
        title: "Structs em C",
        explain: "Structs agrupam dados de tipos diferentes sob um nome — equivalente a um objeto simples sem métodos. O '.' acessa campos. Structs são a base para entender classes em C++ e OOP.",
      },
      {
        code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n = 5;\n    int *arr = malloc(n * sizeof(int));\n    for (int i = 0; i < n; i++)\n        arr[i] = i * 10;\n    for (int i = 0; i < n; i++)\n        printf(\"%d \", arr[i]);\n    free(arr);\n    return 0;\n}`,
        title: "Alocação dinâmica (malloc/free)",
        explain: "malloc aloca memória em tempo de execução no heap. Você especifica o tamanho em bytes. SEMPRE use free() para liberar depois — vazamentos de memória são bugs sérios em C e não aparecem imediatamente.",
      },
    ],
  },
};
