/**
 * data/texts.js
 *
 * Textos para o treino de digitação, separados por nível de dificuldade.
 * Você pode adicionar mais textos em qualquer nível livremente.
 *
 * Níveis:
 *   easy    → palavras e frases simples, vocabulário comum
 *   medium  → frases completas, vocabulário técnico básico
 *   hard    → textos longos, termos técnicos, pontuação variada
 *   extreme → símbolos, código, caracteres especiais, velocidade máxima
 */

export const TEXTS = {
  easy: [
    "o sol brilha forte no céu azul claro",
    "gato come peixe todo dia bem cedo",
    "casa bonita com jardim e flores coloridas",
    "livro novo sobre o tempo e o vento forte",
    "agua fria no copo limpo sobre a mesa",
    "pão quente saindo do forno agora mesmo",
    "carro azul na rua longa da cidade grande",
    "criança ri e pula no parque verde bonito",
    "noite fria e estrelas no céu limpo e escuro",
    "café quente pela manhã faz muito bem para todos",
    "o cachorro late e corre pelo quintal feliz",
    "a chuva molha as flores do jardim",
    "vento suave balança as folhas das árvores",
    "a lua ilumina o caminho na noite calma",
    "crianças brincam na praça com muita alegria",
  ],

  medium: [
    "A prática constante é o segredo para dominar qualquer habilidade com excelência.",
    "Digitação rápida é uma habilidade essencial no mundo digital moderno e competitivo.",
    "Cada erro cometido durante o treino é uma oportunidade valiosa para melhorar a técnica.",
    "Consistência supera talento quando o talento não pratica com consistência e determinação.",
    "Foque nos dedos certos, mantenha a postura e sua velocidade vai aumentar naturalmente.",
    "O teclado mecânico oferece feedback tátil superior para digitadores profissionais experientes.",
    "Desenvolver memória muscular leva tempo mas os resultados valem cada minuto investido.",
    "Treinar todos os dias por apenas quinze minutos produz resultados surpreendentes ao longo do tempo.",
    "A velocidade vem com a precisão; não tente ir rápido antes de alcançar acurácia total.",
    "Programadores que digitam rápido entregam código mais rápido e têm mais tempo para pensar.",
    "O foco durante o treino é tão importante quanto a frequência das sessões de prática diária.",
    "Manter os pulsos retos e os ombros relaxados evita lesões por esforço repetitivo.",
    "A posição correta dos dedos no teclado é a base de qualquer técnica de digitação eficiente.",
    "Grandes digitadores treinam como atletas: com método, paciência e análise constante dos resultados.",
  ],

  hard: [
    "Embora a velocidade de digitação seja importante, a precisão absoluta deve sempre ser priorizada acima de tudo, pois erros frequentes comprometem severamente a produtividade real de qualquer profissional.",
    "O desenvolvimento de habilidades motoras finas requer prática deliberada, focada e consistente ao longo de semanas e meses, não apenas horas isoladas de esforço intenso e não-planejado.",
    "Sistemas distribuídos modernos enfrentam desafios complexos de consistência eventual, particionamento de rede e latência variável que exigem arquiteturas sofisticadas e resilientes.",
    "A inteligência artificial generativa transformou radicalmente o cenário tecnológico, criando oportunidades inéditas mas também levantando questões éticas profundas sobre autoria e responsabilidade.",
    "Digitar com precisão superior a noventa por cento enquanto mantém velocidade acima de oitenta palavras por minuto é considerado nível profissional avançado na maioria das métricas.",
    "Algoritmos de compressão de dados utilizam princípios matemáticos elegantes para representar informações complexas com muito menos bits do que seria necessário em formato bruto original.",
    "A memória cache de processadores modernos opera em múltiplos níveis hierárquicos, cada um progressivamente maior e mais lento, otimizando o acesso a dados frequentemente utilizados.",
    "Programação funcional enfatiza imutabilidade, funções puras e composição para criar sistemas mais previsíveis, testáveis e resistentes a bugs difíceis de reproduzir em produção.",
  ],

  extreme: [
    "Fx2!kP#9mQ@8nR$vL%3wJ^zY&1bH*sT(qA)eI_oU-dG=cN+lV~mK`pX{fB}|hZ<rW>xE?yC:jD;uS,aM.iO/nT",
    "sys.path.insert(0, '/usr/lib'); from collections import defaultdict, OrderedDict; import asyncio, threading, subprocess",
    "Nação Ação Coração Limão Avião Situação Educação Condição Solidão Reunião Eleição Atenção Função",
    "git commit -am 'fix: resolve race condition in async handler'; git push origin feature/perf-optimization --force-with-lease",
    "O rápido desenvolvimento de modelos de linguagem de grande escala (LLMs) redefiniu completamente os paradigmas de interação humano-computador em 2024 e além.",
    "const fn = async (x: number): Promise<{result: number; meta: Record<string, unknown>}> => ({ result: x ** 2, meta: {} });",
    "SELECT u.name, COUNT(o.id) AS total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.status = 'completed' GROUP BY u.name HAVING total > 5;",
    "docker run --rm -it -p 8080:80 -v $(pwd):/app -e NODE_ENV=production --name typeblitz node:18-alpine sh -c 'cd /app && npm start'",
    "192.168.1.0/24 → 255.255.255.0 CIDR; IPv6: fe80::1%lo0; MAC: 00:1A:2B:3C:4D:5E; TTL=64; MTU=1500; PORT=443;",
    "#include <stdio.h>\nint main() { printf(\"Hello!\\n\"); return 0; }",
  ],
};
