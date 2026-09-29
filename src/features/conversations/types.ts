export type ConversationRole =
  | 'unknown'
  | 'customer'
  | 'agent'
  | 'bot'
  | 'system'

export type ConversationEvent = {
  id: string
  time: string
  role: ConversationRole
  authorName: string

  text?: string
  type?: string
  subtype?: string
  clicked?: boolean
}

export type Conversation = {
  id: string
  chatId: string

  date: string
  startTime: string
  endTime?: string

  house: string
  agent: string
  team?: string

  tags: string[]

  durationSeconds: number
  waitSeconds?: number
  serviceSeconds?: number

  rating: 'good' | 'bad' | null
  ratingComment?: string

  resolved?: string
  firstTime?: string

  bot: {
    participated: boolean
    name?: string
  }

  customer: {
    name?: string
    email?: string
    phone?: string
    city?: string
    country?: string
  }

  events: ConversationEvent[]
}
