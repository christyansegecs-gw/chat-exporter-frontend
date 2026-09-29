import {
  type FormEvent,
  useCallback,
  useMemo,
  useState,
} from 'react'
import {
  FilterBar,
  type Filters,
} from '../features/filters'

import {
  ConversationWorkspace,
  type Conversation,
} from '../features/conversations'
import {
  ApiError,
  type ConversationDetailApi,
  fetchFilterOptions,
  searchConversations,
} from '../features/conversations/api/conversationsApi'

const emptyFilters: Filters = {
  startDate: '',
  endDate: '',
  houses: [],
  tags: [],
  agents: [],
  tagsMode: 'any',
}

function toConversationDetail(
  apiConversation: ConversationDetailApi,
): Conversation {
  const normalizedRating =
    apiConversation.rating === 'good' ||
    apiConversation.rating === 'bad'
      ? apiConversation.rating
      : null

  return {
    id: apiConversation.id,
    chatId: apiConversation.chat_id,
    date: apiConversation.date,
    startTime: apiConversation.start_time,
    endTime: apiConversation.end_time ?? undefined,
    house: apiConversation.house,
    agent: apiConversation.agent,
    team: apiConversation.team ?? undefined,
    tags: apiConversation.tags,
    durationSeconds: apiConversation.duration_seconds,
    waitSeconds: apiConversation.wait_seconds ?? undefined,
    serviceSeconds:
      apiConversation.service_seconds ?? undefined,
    rating: normalizedRating,
    resolved: apiConversation.resolved ?? undefined,
    firstTime: apiConversation.first_time ?? undefined,
    bot: {
      participated: Boolean(
        apiConversation.bot?.participated,
      ),
      name: apiConversation.bot?.name ?? undefined,
    },
    customer: {
      name: apiConversation.customer?.name ?? undefined,
      email: apiConversation.customer?.email ?? undefined,
      city: apiConversation.customer?.city ?? undefined,
      country:
        apiConversation.customer?.country ?? undefined,
    },
    events: apiConversation.events.map((event) => ({
      id: event.id,
      time: event.time,
      role: event.role as Conversation['events'][number]['role'],
      authorName: event.author_name,
      text: event.text ?? undefined,
      type: event.type ?? undefined,
      subtype: event.subtype ?? undefined,
      clicked: Boolean(event.clicked),
    })),
  }
}

function Login({
  onLogin,
  loading,
  error,
}: {
  onLogin: (token: string) => Promise<void>
  loading: boolean
  error?: string
}) {
  const [value, setValue] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const token = value.trim()
    if (!token) return

    await onLogin(token)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--ds-bg)] px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-lg border border-[var(--ds-line)] bg-[var(--ds-panel)] p-8"
      >
        <div className="font-mono text-[10px] tracking-[0.18em] text-[var(--ds-gold)]">
          GAMEWIZ // CHAT EXPORTER
        </div>

        <h1 className="mt-3 text-3xl font-light tracking-[0.08em]">
          ACESSO AO TERMINAL
        </h1>

        <p className="mt-3 text-sm leading-6 text-[var(--ds-muted)]">
          Informe sua credencial de acesso à API. O token é mantido
          apenas nesta página e não é gravado pelo frontend.
        </p>

        <label className="mt-7 block">
          <span className="font-mono text-[9px] tracking-[0.14em] text-[var(--ds-muted)]">
            BEARER TOKEN
          </span>

          <input
            type="password"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="mt-2 h-12 w-full border border-[var(--ds-line)] bg-[var(--ds-bg)] px-4 font-mono text-sm text-[var(--ds-text)] outline-none transition focus:border-[var(--ds-cyan)]"
            placeholder="Cole seu token de acesso"
          />
        </label>

        {error && (
          <div className="mt-4 border border-[#7b4d45] bg-[#2b191680] px-4 py-3 text-sm text-[#efb5aa]">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="mt-6 w-full border border-[var(--ds-gold)] px-4 py-3 font-mono text-[11px] tracking-[0.16em] text-[var(--ds-gold)] transition hover:bg-[#25261e80] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'VALIDANDO...' : 'CONECTAR'}
        </button>
      </form>
    </div>
  )
}

function App() {
  const [token, setToken] = useState('')
  const [filters, setFilters] =
    useState<Filters>(emptyFilters)
  const [conversations, setConversations] =
    useState<Conversation[]>([])
  const [availableHouses, setAvailableHouses] =
    useState<string[]>([])
  const [availableTags, setAvailableTags] =
    useState<string[]>([])
  const [availableAgents, setAvailableAgents] =
    useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string>()
  const [searchError, setSearchError] = useState<string>()

  const handleLogin = useCallback(async (candidate: string) => {
    setLoginLoading(true)
    setLoginError(undefined)

    try {
      const houses = await fetchFilterOptions(
        'houses',
        candidate,
      )
      const tags = await fetchFilterOptions(
        'tags',
        candidate,
      )
      const agents = await fetchFilterOptions(
        'agents',
        candidate,
      )

      setAvailableHouses(houses)
      setAvailableTags(tags)
      setAvailableAgents(agents)
      setToken(candidate)
    } catch (error) {
      if (error instanceof ApiError) {
        setLoginError(error.message)
      } else {
        setLoginError('Não foi possível conectar à API.')
      }
    } finally {
      setLoginLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken('')
    setConversations([])
    setFilters(emptyFilters)
    setSearchError(undefined)
  }, [])

  const runSearch = useCallback(async () => {
    if (!filters.startDate || !filters.endDate) {
      setSearchError(
        'Informe a data inicial e a data final antes de buscar.',
      )
      return
    }

    if (filters.startDate > filters.endDate) {
      setSearchError(
        'A data inicial não pode ser posterior à data final.',
      )
      return
    }

    setSearchError(undefined)
    setLoading(true)

    try {
      const response = await searchConversations(
        {
          start_date: filters.startDate,
          end_date: filters.endDate,
          houses: filters.houses,
          tags: filters.tags,
          agents: filters.agents,
          tags_mode: filters.tagsMode,
        },
        token,
      )

      setConversations(
        response.items.map(toConversationDetail),
      )
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout()
        setLoginError('Sua credencial expirou ou foi revogada.')
        return
      }

      setSearchError(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível buscar as conversas.',
      )
      setConversations([])
    } finally {
      setLoading(false)
    }
  }, [filters, logout, token])

  const summaryText = useMemo(() => {
    if (loading) {
      return 'BUSCANDO CONEXÕES...'
    }

    if (conversations.length === 0) {
      return 'NENHUMA CONEXÃO LOCALIZADA'
    }

    return `${conversations.length} CONVERSAS LOCALIZADAS`
  }, [conversations.length, loading])

  if (!token) {
    return (
      <Login
        onLogin={handleLogin}
        loading={loginLoading}
        error={loginError}
      />
    )
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--ds-line)] bg-[#0b1011e6]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-5 lg:px-10">
          <div className="font-mono text-xs font-bold tracking-[0.28em]">
            GAMEWIZ // CHAT EXPORTER
          </div>

          <div className="flex items-center gap-5">
            <div className="font-mono text-[10px] tracking-[0.12em] text-[var(--ds-cyan)]">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--ds-cyan)] shadow-[0_0_12px_var(--ds-cyan)]" />
              CONEXÃO ESTABELECIDA
            </div>

            <button
              type="button"
              onClick={logout}
              className="font-mono text-[9px] tracking-[0.14em] text-[var(--ds-muted)] transition hover:text-[var(--ds-gold)]"
            >
              DESCONECTAR
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-10">
        <header className="mb-9 flex flex-col justify-between gap-6 border-b border-[var(--ds-line)] pb-8 lg:flex-row lg:items-end">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ds-muted)]">
              Customer Experience / Data Terminal
            </div>

            <h1 className="mt-3 text-3xl font-light tracking-[0.13em] md:text-5xl">
              CHAT <span className="text-[var(--ds-gold)]">EXPORTER</span>
            </h1>

            <p className="mt-3 font-mono text-[10px] tracking-[0.35em] text-[var(--ds-muted)]">
              CONNECTION ARCHIVE
            </p>
          </div>

          <div className="text-left font-mono text-[10px] leading-5 text-[var(--ds-muted)] lg:text-right">
            GAMEWIZ // CX OPERATIONS
            <br />
            INTERNAL DATA TERMINAL
            <br />
            BUILD // PROD
          </div>
        </header>

        <FilterBar
          value={filters}
          onChange={setFilters}
          onSearch={() => {
            void runSearch()
          }}
          housesOptions={availableHouses}
          tagsOptions={availableTags}
          agentsOptions={availableAgents}
        />

        {searchError && (
          <div className="mt-5 border border-[#7b4d45] bg-[#2b191680] px-4 py-3 text-sm text-[#efb5aa]">
            {searchError}
          </div>
        )}

        <div className="mb-4 mt-9 flex items-end justify-between border-b border-[var(--ds-line)] pb-4">
          <div>
            <span className="font-mono text-[10px] tracking-[0.18em] text-[var(--ds-gold)]">
              SEARCH RESULT
            </span>

            <div className="mt-1">
              <span className="text-3xl font-light">
                {conversations.length}
              </span>

              <span className="ml-2 font-mono text-[10px] text-[var(--ds-muted)]">
                {summaryText}
              </span>
            </div>
          </div>

          <span className="hidden font-mono text-[10px] text-[var(--ds-muted)] md:block">
            SELECT CONNECTION // OPEN EVENT LOG
          </span>
        </div>

        <ConversationWorkspace conversations={conversations} />

        <footer className="mt-8 flex justify-between border-t border-[var(--ds-line)] pt-5 font-mono text-[9px] tracking-wider text-[var(--ds-muted)]">
          <span>GAMEWIZ // INTERNAL USE</span>
          <span>KEEP ON KEEPING ON.</span>
        </footer>
      </div>
    </div>
  )
}

export default App
