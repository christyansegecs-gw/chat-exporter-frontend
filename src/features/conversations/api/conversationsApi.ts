export type ApiSearchFilters = {
  start_date?: string
  end_date?: string
  houses?: string[]
  tags?: string[]
  agents?: string[]
  tags_mode?: 'any' | 'all'
}

export type ConversationDetailApi = {
  id: string
  chat_id: string
  thread_key: string
  date: string
  start_time: string
  end_time?: string | null
  house: string
  agent: string
  team?: string | null
  tags: string[]
  duration_seconds: number
  wait_seconds?: number | null
  service_seconds?: number | null
  rating?: string | null
  resolved?: string | null
  first_time?: string | null
  bot: {
    participated?: boolean
    name?: string | null
  }
  customer: {
    id?: string | null
    name?: string | null
    email?: string | null
    city?: string | null
    country?: string | null
  }
  events: Array<{
    id: string
    time: string
    role: string
    author_name: string
    text?: string | null
    type?: string | null
    subtype?: string | null
    clicked?: boolean
    created_at?: string | null
    author_id?: string | null
    author_type?: string | null
    visibility?: string | null
    payload?: unknown
  }>
}

export type SearchResponseApi = {
  items: ConversationDetailApi[]
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const API_BASE_URL = '/api'

async function apiRequest<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new ApiError(
        'Credencial inválida ou expirada.',
        response.status,
      )
    }

    throw new ApiError(
      `Falha na API (HTTP ${response.status}).`,
      response.status,
    )
  }

  return (await response.json()) as T
}

export async function fetchFilterOptions(
  type: 'houses' | 'tags' | 'agents',
  token: string,
): Promise<string[]> {
  const body = await apiRequest<{ items?: string[] }>(
    `/filters/${type}`,
    token,
  )

  return body.items ?? []
}

export async function searchConversations(
  payload: ApiSearchFilters,
  token: string,
): Promise<SearchResponseApi> {
  return apiRequest<SearchResponseApi>(
    '/conversations/search',
    token,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )
}
