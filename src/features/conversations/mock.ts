import type { Conversation } from './types'

export const mockConversations: Conversation[] = [
  {
    id: 'TK8F7Q2A91',
    chatId: 'TF92KM7X1A',

    date: '2026-08-31',
    startTime: '22:13',
    endTime: '22:17',

    house: 'FOGO777',
    agent: 'Gabriel',
    team: 'General',

    tags: [
      'Cassino - Falta de Ganhos',
    ],

    durationSeconds: 271,
    waitSeconds: 31,
    serviceSeconds: 240,

    rating: 'bad',
    ratingComment: 'Não resolveu minha dúvida.',

    resolved: 'Não',
    firstTime: 'Sim',

    bot: {
      participated: true,
      name: 'FOGO777',
    },

    customer: {
      name: 'Cliente exemplo',
      city: 'São Paulo',
      country: 'BR',
    },

    events: [
      {
        id: '1',
        time: '22:13:01',
        role: 'customer',
        authorName: 'Cliente',
        text: 'Estou jogando há alguns dias e não estou tendo ganhos.',
      },
      {
        id: '2',
        time: '22:13:08',
        role: 'bot',
        authorName: 'FOGO777',
        text: 'Entendi. Selecione uma das opções para que eu possa ajudar.',
      },
      {
        id: '3',
        time: '22:13:14',
        role: 'customer',
        authorName: 'Cliente',
        text: 'Cassino e Jogos',
        clicked: true,
      },
      {
        id: '4',
        time: '22:13:20',
        role: 'system',
        authorName: 'Sistema',
        type: 'system_message',
        subtype: 'chat_transferred',
        text: 'Conversa transferida para General.',
      },
      {
        id: '5',
        time: '22:13:31',
        role: 'agent',
        authorName: 'Gabriel',
        text: 'Olá! Sou Gabriel e vou seguir com seu atendimento.',
      },
      {
        id: '6',
        time: '22:14:02',
        role: 'customer',
        authorName: 'Cliente',
        text: 'Queria entender por que não estou ganhando.',
      },
      {
        id: '7',
        time: '22:14:35',
        role: 'agent',
        authorName: 'Gabriel',
        text: 'Os resultados dos jogos são aleatórios e não existe garantia de ganhos.',
      },
    ],
  },

  {
    id: 'TK1P8N4C72',
    chatId: 'TF82PM4Q5C',

    date: '2026-08-30',
    startTime: '18:42',
    endTime: '18:44',

    house: 'FOGO777',
    agent: 'Leyla',
    team: 'General',

    tags: [
      'Apostas Esportivas-Falta de Ganhos',
    ],

    durationSeconds: 138,
    waitSeconds: 18,
    serviceSeconds: 120,

    rating: 'good',
    resolved: 'Sim',

    bot: {
      participated: true,
      name: 'FOGO777',
    },

    customer: {
      name: 'Cliente exemplo 2',
      city: 'Santos',
      country: 'BR',
    },

    events: [
      {
        id: '1',
        time: '18:42:03',
        role: 'customer',
        authorName: 'Cliente',
        text: 'Estou perdendo todas as apostas esportivas.',
      },
      {
        id: '2',
        time: '18:42:12',
        role: 'bot',
        authorName: 'FOGO777',
        text: 'Posso ajudar com informações sobre apostas e jogos.',
      },
      {
        id: '3',
        time: '18:42:22',
        role: 'system',
        authorName: 'Sistema',
        subtype: 'chat_transferred',
        text: 'Conversa transferida para atendimento humano.',
      },
      {
        id: '4',
        time: '18:42:35',
        role: 'agent',
        authorName: 'Leyla',
        text: 'Olá! Vou acompanhar seu atendimento.',
      },
      {
        id: '5',
        time: '18:43:10',
        role: 'agent',
        authorName: 'Leyla',
        text: 'O resultado de cada aposta depende do evento e das condições do bilhete.',
      },
    ],
  },

  {
    id: 'TK6M3Q8B54',
    chatId: 'TI28PD7W3B',

    date: '2026-08-29',
    startTime: '13:05',
    endTime: '13:12',

    house: 'iJOGO',
    agent: 'Anderson',
    team: 'General',

    tags: [
      'Atendimento-Cliente se ausentou',
    ],

    durationSeconds: 418,
    waitSeconds: 42,
    serviceSeconds: 376,

    rating: null,

    bot: {
      participated: true,
      name: 'iJOGO',
    },

    customer: {
      name: 'Cliente exemplo 3',
      country: 'BR',
    },

    events: [
      {
        id: '1',
        time: '13:05:02',
        role: 'customer',
        authorName: 'Cliente',
        text: 'Preciso de ajuda com minha conta.',
      },
      {
        id: '2',
        time: '13:05:11',
        role: 'bot',
        authorName: 'iJOGO',
        text: 'Vou transferi-lo para um especialista.',
      },
      {
        id: '3',
        time: '13:05:18',
        role: 'system',
        authorName: 'Sistema',
        subtype: 'chat_transferred',
        text: 'Conversa transferida para General.',
      },
      {
        id: '4',
        time: '13:05:32',
        role: 'agent',
        authorName: 'Anderson',
        text: 'Olá! Como posso ajudar?',
      },
      {
        id: '5',
        time: '13:12:00',
        role: 'system',
        authorName: 'Sistema',
        subtype: 'routing.archived_inactive',
        text: 'Chat encerrado por inatividade.',
      },
    ],
  },
]