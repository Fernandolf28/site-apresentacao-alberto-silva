export type SectionId =
  | 'direcao'
  | 'coordenacao'
  | 'gremio'
  | 'organizacao-seguranca';

export interface PersonMember {
  id: string;
  name: string;
  role: string;
  info: string;
  photoDataUrl?: string;
}

export interface SchoolSectionConfig {
  id: SectionId;
  buttonLabel: string;
  adminLabel: string;
  bandBg: string;
  bandText: string;
  hasBandBorder: boolean;
  bandWidthClasses: string;
  photoAlt: string;
  defaultMembers: PersonMember[];
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  accentBg: string;
  theme: 'campus' | 'library' | 'sports' | 'community';
  imageDataUrl?: string;
}

export interface HomeInfoSection {
  id: string;
  title: string;
  content: string;
  accentColor: string;
}

export interface TeacherMember {
  id: string;
  name: string;
  subject: string;
  info: string;
  photoDataUrl?: string;
}

export const SCHOOL_SECTIONS: SchoolSectionConfig[] = [
  {
    id: 'direcao',
    buttonLabel: 'Direção',
    adminLabel: 'Diretora e equipe',
    bandBg: 'rgb(255, 49, 49)',
    bandText: '#000000',
    hasBandBorder: true,
    bandWidthClasses: 'mr-[8%] md:mr-[25%]',
    photoAlt: 'Foto representativa da Direção Escolar',
    defaultMembers: [
      {
        id: 'dir-1',
        name: 'Maria Helena Vasconcelos',
        role: 'Diretora Geral',
        info: 'Responsável pela gestão administrativa e pedagógica da escola, garantindo um ambiente acolhedor, organizado e comprometido com o aprendizado. Atua em parceria com professores, funcionários, estudantes e famílias para fortalecer toda a comunidade escolar.',
      },
    ],
  },
  {
    id: 'coordenacao',
    buttonLabel: 'Coordenação e Secretaria',
    adminLabel: 'Coordenação e Secretaria',
    bandBg: 'rgb(255, 222, 0)',
    bandText: '#000000',
    hasBandBorder: true,
    bandWidthClasses: 'mr-[12%] md:mr-[50%] md:min-w-[440px]',
    photoAlt: 'Foto representativa da Coordenação e Secretaria',
    defaultMembers: [
      {
        id: 'coord-1',
        name: 'Mariana Costa Almeida',
        role: 'Coordenadora Pedagógica (Manhã)',
        info: 'Acompanha o planejamento das aulas, projetos interdisciplinares e atendimento às famílias no turno da manhã.',
      },
      {
        id: 'coord-2',
        name: 'Ricardo Henrique Sousa',
        role: 'Coordenador Pedagógico (Tarde)',
        info: 'Orienta os professores nas avaliações, conselhos de classe e acompanhamento do rendimento dos estudantes.',
      },
      {
        id: 'coord-3',
        name: 'Fernanda Oliveira Lima',
        role: 'Coordenadora de Área e Projetos',
        info: 'Organiza feiras de conhecimento, olimpíadas escolares e atividades de reforço e monitoria.',
      },
      {
        id: 'coord-4',
        name: 'Paulo Roberto Mendes',
        role: 'Secretário Escolar Geral',
        info: 'Responsável pela documentação oficial, históricos escolares, atas e registros acadêmicos da instituição.',
      },
      {
        id: 'coord-5',
        name: 'Juliana Pereira Santos',
        role: 'Auxiliar de Secretaria (Matrículas)',
        info: 'Atende solicitações de matrículas, transferências, declarações e atualização de cadastros.',
      },
      {
        id: 'coord-6',
        name: 'Carlos Eduardo Rocha',
        role: 'Auxiliar de Secretaria (Frequência e Diários)',
        info: 'Auxilia no controle de frequência, lançamento de boletins e suporte administrativo aos docentes.',
      },
      {
        id: 'coord-7',
        name: 'Patrícia Gomes Ferreira',
        role: 'Atendimento e Apoio Administrativo',
        info: 'Realiza a triagem de atendimento na secretaria, comunicados escolares e organização de arquivos.',
      },
    ],
  },
  {
    id: 'gremio',
    buttonLabel: 'Grêmio',
    adminLabel: 'Grêmio',
    bandBg: 'rgb(0, 56, 255)',
    bandText: '#FFFFFF',
    hasBandBorder: true,
    bandWidthClasses: 'mr-[28%] md:mr-[75%] md:min-w-[240px]',
    photoAlt: 'Foto representativa do Grêmio Estudantil',
    defaultMembers: [
      {
        id: 'gremio-1',
        name: 'Lucas Gabriel Ferreira',
        role: 'Presidente',
        info: 'Representa o grêmio nas reuniões com a direção e coordena todas as frentes de atuação estudantil.',
      },
      {
        id: 'gremio-2',
        name: 'Beatriz Martins Souza',
        role: 'Vice-Presidente',
        info: 'Apoia a presidência na organização de assembleias, pautas estudantis e acompanhamento dos projetos.',
      },
      {
        id: 'gremio-3',
        name: 'Pedro Henrique Alves',
        role: '1º Secretário',
        info: 'Redige atas de reuniões, organiza a pauta das assembleias e mantém os registros do grêmio atualizados.',
      },
      {
        id: 'gremio-4',
        name: 'Camila Rodrigues Dias',
        role: '2ª Secretária',
        info: 'Auxilia na documentação, listas de presença e comunicação interna com os representantes de turma.',
      },
      {
        id: 'gremio-5',
        name: 'Matheus Vinícius Barbosa',
        role: '1º Tesoureiro',
        info: 'Administra recursos, presta contas de arrecadações e acompanha orçamentos de eventos estudantis.',
      },
      {
        id: 'gremio-6',
        name: 'Larissa Ribeiro Castro',
        role: '2ª Tesoureira',
        info: 'Auxilia no controle de caixa, notas de compras e transparência financeira junto aos alunos.',
      },
      {
        id: 'gremio-7',
        name: 'João Victor Carvalho',
        role: 'Diretor de Esportes',
        info: 'Organiza interclasses, torneios esportivos, gincanas e uso compartilhado das quadras.',
      },
      {
        id: 'gremio-8',
        name: 'Isabela Fernandes Moura',
        role: 'Vice-Diretora de Esportes',
        info: 'Coordena tabelas de jogos, inscrições de equipes e integração esportiva entre os turnos.',
      },
      {
        id: 'gremio-9',
        name: 'Rafael Augusto Nogueira',
        role: 'Diretor de Cultura e Eventos',
        info: 'Planeja festivais culturais, apresentações artísticas, datas comemorativas e saraus escolares.',
      },
      {
        id: 'gremio-10',
        name: 'Sofia Teixeira Lopes',
        role: 'Vice-Diretora de Cultura e Eventos',
        info: 'Apoia a curadoria cultural, oficinas criativas e organização de espaços para apresentações.',
      },
      {
        id: 'gremio-11',
        name: 'Gustavo Henrique Pinto',
        role: 'Diretor de Comunicação',
        info: 'Cuida dos murais informativos, divulgação dos eventos e cobertura fotográfica das ações.',
      },
      {
        id: 'gremio-12',
        name: 'Amanda Araújo Cardoso',
        role: 'Vice-Diretora de Comunicação',
        info: 'Produz avisos, textos informativos e acompanha caixas de sugestões dos estudantes.',
      },
      {
        id: 'gremio-13',
        name: 'Thiago Moreira Batista',
        role: 'Diretor Social e Meio Ambiente',
        info: 'Promove campanhas solidárias, arrecadações e ações de sustentabilidade e cuidado com a escola.',
      },
      {
        id: 'gremio-14',
        name: 'Giovanna Freitas Cunha',
        role: 'Diretora de Políticas Educacionais',
        info: 'Reúne demandas sobre biblioteca, laboratórios e apoio aos estudos para levar à coordenação.',
      },
      {
        id: 'gremio-15',
        name: 'Bruno César Monteiro',
        role: 'Conselheiro de Turma (1º Ano)',
        info: 'Faz a ponte entre as turmas do 1º ano e a diretoria do grêmio, trazendo ideias e sugestões.',
      },
      {
        id: 'gremio-16',
        name: 'Letícia Campos Vieira',
        role: 'Conselheira de Turma (2º Ano)',
        info: 'Representa as demandas dos estudantes do 2º ano nas decisões e atividades estudantis.',
      },
      {
        id: 'gremio-17',
        name: 'Daniel Santana Ribeiro',
        role: 'Conselheiro de Turma (3º Ano)',
        info: 'Acompanha projetos voltados aos concluintes, vestibulares e integração escolar.',
      },
      {
        id: 'gremio-18',
        name: 'Yasmin Duarte Correia',
        role: 'Suplente de Diretoria',
        info: 'Apoia todas as diretorias na execução de eventos, montagem de espaços e logística.',
      },
      {
        id: 'gremio-19',
        name: 'Cauã Nascimento Melo',
        role: 'Suplente de Diretoria',
        info: 'Auxilia na organização geral das ações do grêmio e substituição de membros quando necessário.',
      },
    ],
  },
  {
    id: 'organizacao-seguranca',
    buttonLabel: 'Organização e Segurança da Escola',
    adminLabel: 'Organização e Segurança',
    bandBg: 'rgb(255, 252, 193)',
    bandText: '#000000',
    hasBandBorder: false,
    bandWidthClasses: 'mr-0',
    photoAlt: 'Foto representativa da Organização e Segurança da Escola',
    defaultMembers: [
      {
        id: 'seg-1',
        name: 'José Antônio Bezerra',
        role: 'Porteiro (Turno Manhã)',
        info: 'Controla a entrada e saída de alunos, visitantes e entregas no período da manhã com atenção e cordialidade.',
      },
      {
        id: 'seg-2',
        name: 'Marcos Vinícius Tavares',
        role: 'Porteiro (Turno Tarde)',
        info: 'Acompanha o fluxo de acesso no turno da tarde e orienta responsáveis na chegada e saída.',
      },
      {
        id: 'seg-3',
        name: 'Sandra Regina Moraes',
        role: 'Inspetora de Alunos (Pátio e Corredores)',
        info: 'Zela pela convivência tranquila nos intervalos, corredores e entrada das salas de aula.',
      },
      {
        id: 'seg-4',
        name: 'Cláudio Roberto Azevedo',
        role: 'Inspetor de Alunos e Prevenção',
        info: 'Acompanha áreas externas, quadra e rotas de circulação para garantir segurança durante todo o expediente.',
      },
      {
        id: 'seg-5',
        name: 'Maria do Carmo Sales',
        role: 'Auxiliar de Serviços Gerais (Salas e Corredores)',
        info: 'Mantém as salas de aula, banheiros e corredores limpos, higienizados e organizados diariamente.',
      },
      {
        id: 'seg-6',
        name: 'Antônia Lúcia Farias',
        role: 'Auxiliar de Serviços Gerais (Pátio e Refeitório)',
        info: 'Cuida da limpeza e organização do refeitório, áreas de convivência e bebedouros.',
      },
      {
        id: 'seg-7',
        name: 'Roberto Carlos Nascimento',
        role: 'Manutenção e Conservação Predial',
        info: 'Realiza reparos preventivos em portas, iluminação, mobiliário e equipamentos da escola.',
      },
      {
        id: 'seg-8',
        name: 'Adriana Paula Vasconcelos',
        role: 'Apoio à Brigada Escolar e Bem-Estar',
        info: 'Acompanha protocolos de primeiros socorros, sinalização de segurança e organização de emergências.',
      },
    ],
  },
];

export const DEFAULT_CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 'slide-1',
    title: 'Bem-vindos à Nossa Escola',
    subtitle:
      'Um espaço de aprendizagem, convivência e construção coletiva para estudantes, famílias e educadores.',
    accentBg: '#17A700',
    theme: 'campus',
  },
  {
    id: 'slide-2',
    title: 'Projetos Pedagógicos e Leitura',
    subtitle:
      'Atividades em sala, biblioteca e oficinas que incentivam a curiosidade, a pesquisa e o protagonismo.',
    accentBg: '#FFDE00',
    theme: 'library',
  },
  {
    id: 'slide-3',
    title: 'Esporte, Cultura e Grêmio Ativo',
    subtitle:
      'Campeonatos interclasses, feiras culturais e ações organizadas junto com os representantes estudantis.',
    accentBg: '#0038FF',
    theme: 'sports',
  },
  {
    id: 'slide-4',
    title: 'Ambiente Seguro e Organizado',
    subtitle:
      'Cuidado diário com cada espaço da escola para garantir tranquilidade e bem-estar a todos.',
    accentBg: '#FF3131',
    theme: 'community',
  },
];

export const DEFAULT_HOME_INFO_SECTIONS: HomeInfoSection[] = [
  {
    id: 'info-1',
    title: 'Estrutura da Escola',
    content:
      'O CETI Gov. Alberto Tavares Silva conta com salas de aula climatizadas, laboratório de informática e tecnologia, biblioteca, refeitório, quadra poliesportiva e acessibilidade em todo o prédio escolar para atender os estudantes em tempo integral.',
    accentColor: '#17A700',
  },
  {
    id: 'info-2',
    title: 'Professores e suas Informações',
    content:
      'Conheça os docentes que acompanham o desenvolvimento acadêmico e os projetos tecnológicos e culturais dos nossos estudantes.',
    accentColor: '#0038FF',
  },
];

export const DEFAULT_TEACHERS: TeacherMember[] = [
  {
    id: 'prof-1',
    name: 'Prof. Marcos Vinícius Lima',
    subject: 'Matemática',
    info: 'Atua com resolução de problemas, olimpíadas de matemática e oficinas de raciocínio lógico.',
  },
  {
    id: 'prof-2',
    name: 'Profa. Carla Beatriz Santos',
    subject: 'Língua Portuguesa e Redação',
    info: 'Coordena oficinas de leitura, produção textual e projetos literários no tempo integral.',
  },
  {
    id: 'prof-3',
    name: 'Prof. Rafael Augusto Moura',
    subject: 'Tecnologia e Informática',
    info: 'Orienta práticas de programação, robótica educacional e projetos digitais na escola.',
  },
  {
    id: 'prof-4',
    name: 'Profa. Juliana Ferreira Costa',
    subject: 'Ciências e Biologia',
    info: 'Desenvolve experimentos em laboratório, feiras científicas e educação ambiental.',
  },
  {
    id: 'prof-5',
    name: 'Prof. Eduardo Henrique Alves',
    subject: 'História e Cidadania',
    info: 'Conduz debates, projetos culturais e estudos sobre história regional e sociedade.',
  },
  {
    id: 'prof-6',
    name: 'Profa. Patrícia Oliveira Dias',
    subject: 'Educação Física',
    info: 'Organiza práticas esportivas, jogos escolares e atividades de saúde e bem-estar.',
  },
];
