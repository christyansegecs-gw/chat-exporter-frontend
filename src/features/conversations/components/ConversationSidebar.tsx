import { useMemo, useState } from 'react'
import type { Conversation } from '../types'

type Props = {
  conversations: Conversation[]
  selectedId?: string
  onSelect: (conversation: Conversation) => void
}

function formatDuration(seconds: number) {
  if (seconds < 60) {
    return `${seconds}s`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes}min${
    remainingSeconds
      ? ` ${remainingSeconds}s`
      : ''
  }`
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
    .format(new Date(`${date}T12:00:00`))
    .replace('.', '')
    .toUpperCase()
}

export function ConversationSidebar({
  conversations,
  selectedId,
  onSelect,
}: Props) {
  const [search, setSearch] = useState('')

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return conversations
    }

    return conversations.filter(
      (conversation) => {
        const searchableText = [
          conversation.id,
          conversation.chatId,
          conversation.house,
          conversation.agent,
          conversation.team ?? '',
          ...conversation.tags,
          ...conversation.events.map(
            (event) => event.text ?? '',
          ),
        ]
          .join(' ')
          .toLowerCase()

        return searchableText.includes(query)
      },
    )
  }, [conversations, search])

  return (
    <aside className="flex min-h-0 flex-col bg-[var(--ds-panel)]">
      <header className="border-b border-[var(--ds-line)] p-4">
        <div className="font-mono text-[10px] tracking-[0.18em] text-[var(--ds-gold)]">
          CONVERSATION INDEX
        </div>

        <div className="mt-2 flex items-end justify-between">
          <strong className="text-3xl font-light">
            {conversations.length}
          </strong>

          <span className="font-mono text-[10px] tracking-wider text-[var(--ds-muted)]">
            REGISTROS
          </span>
        </div>

        <div className="relative mt-4">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[var(--ds-cyan)]">
            ⌕
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Buscar conversa..."
            className="
              h-10
              w-full
              border
              border-[var(--ds-line)]
              bg-[var(--ds-bg)]
              pl-9
              pr-3
              font-mono
              text-xs
              text-[var(--ds-text)]
              outline-none
              transition
              placeholder:text-[#59696b]
              focus:border-[var(--ds-cyan)]
            "
          />
        </div>

        <p className="mt-2 font-mono text-[9px] tracking-wider text-[var(--ds-muted)]">
          {filteredConversations.length}
          {' // '}
          {conversations.length}
          {' DISPONÍVEIS'}
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {filteredConversations.map(
          (conversation) => {
            const selected =
              conversation.id === selectedId

            const firstCustomerMessage =
              conversation.events.find(
                (event) =>
                  event.role === 'customer' &&
                  event.text &&
                  !event.clicked,
              )?.text ??
              'Sem mensagem inicial registrada.'

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() =>
                  onSelect(conversation)
                }
                className={`
                  relative
                  block
                  w-full
                  border-0
                  border-b
                  border-[var(--ds-line-soft)]
                  px-4
                  py-4
                  text-left
                  transition

                  ${
                    selected
                      ? 'bg-[#25261e80]'
                      : 'bg-transparent hover:bg-[var(--ds-panel-hover)]'
                  }
                `}
              >
                <span
                  className={`
                    absolute
                    bottom-0
                    left-0
                    top-0
                    w-[3px]

                    ${
                      selected
                        ? 'bg-[var(--ds-gold)]'
                        : 'bg-transparent'
                    }
                  `}
                />

                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`
                      font-mono
                      text-[11px]
                      tracking-wide

                      ${
                        selected
                          ? 'text-[var(--ds-gold)]'
                          : 'text-[var(--ds-text)]'
                      }
                    `}
                  >
                    {formatDate(
                      conversation.date,
                    )}
                    {' // '}
                    {conversation.startTime}
                  </span>

                  <span className="whitespace-nowrap font-mono text-[9px] text-[var(--ds-muted)]">
                    {formatDuration(
                      conversation.durationSeconds,
                    )}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--ds-text)]">
                    {conversation.agent}
                  </span>

                  {conversation.rating && (
                    <span
                      className={`
                        font-mono
                        text-[9px]
                        tracking-wider

                        ${
                          conversation.rating ===
                          'good'
                            ? 'text-[var(--ds-cyan)]'
                            : 'text-[var(--ds-gold)]'
                        }
                      `}
                    >
                      ◆{' '}
                      {conversation.rating ===
                      'good'
                        ? 'POSITIVO'
                        : 'NEGATIVO'}
                    </span>
                  )}
                </div>

                <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--ds-muted)]">
                  {firstCustomerMessage}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {conversation.tags
                    .slice(0, 2)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="
                          border
                          border-[var(--ds-line)]
                          px-1.5
                          py-1
                          font-mono
                          text-[8px]
                          uppercase
                          tracking-wide
                          text-[var(--ds-muted)]
                        "
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                <div className="mt-3 font-mono text-[8px] tracking-[0.15em] text-[#5e7274]">
                  THREAD // {conversation.id}
                </div>
              </button>
            )
          },
        )}

        {filteredConversations.length === 0 && (
          <div className="px-5 py-10 text-center">
            <div className="font-mono text-xl text-[var(--ds-line)]">
              ◇
            </div>

            <p className="mt-3 font-mono text-[10px] tracking-wider text-[var(--ds-muted)]">
              NENHUMA CONEXÃO LOCALIZADA
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}