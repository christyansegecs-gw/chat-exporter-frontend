import type {
  ConversationEvent,
  ConversationRole,
} from '../types'

type Props = {
  events: ConversationEvent[]
}

const roleStyles: Record<
  ConversationRole,
  {
    label: string
    color: string
    border: string
  }
> = {
  unknown: {
    label: 'NÃO IDENTIFICADO',
    color: 'text-[var(--ds-muted)]',
    border: 'border-l-[var(--ds-line)]',
  },
  customer: {
    label: 'CLIENTE',
    color: 'text-[var(--ds-cyan)]',
    border: 'border-l-[var(--ds-cyan)]',
  },

  agent: {
    label: 'ANALISTA',
    color: 'text-[var(--ds-gold)]',
    border: 'border-l-[var(--ds-gold)]',
  },

  bot: {
    label: 'BOT',
    color: 'text-[var(--ds-purple)]',
    border: 'border-l-[var(--ds-purple)]',
  },

  system: {
    label: 'SYSTEM EVENT',
    color: 'text-[var(--ds-muted)]',
    border: 'border-l-[var(--ds-line)]',
  },
}

export function ConversationTranscript({
  events,
}: Props) {
  return (
    <section className="border border-[var(--ds-line)] bg-[var(--ds-panel)]">
      <header className="flex items-center justify-between border-b border-[var(--ds-line)] px-5 py-4">
        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] text-[var(--ds-gold)]">
            EVENT LOG
          </div>

          <h3 className="mt-1 text-base font-normal">
            Transcrição da conversa
          </h3>
        </div>

        <span className="font-mono text-[10px] text-[var(--ds-muted)]">
          {String(events.length).padStart(2, '0')} EVENTS
        </span>
      </header>

      <div>
        {events.map((event) => {
          const style = roleStyles[event.role] ?? roleStyles.unknown

          return (
            <article
              key={event.id}
              className={`grid border-b border-l-[3px] border-b-[var(--ds-line-soft)] px-5 py-4 last:border-b-0 md:grid-cols-[90px_130px_minmax(0,1fr)] ${style.border}`}
            >
              <span className="font-mono text-[11px] text-[var(--ds-muted)]">
                {event.time}
              </span>

              <div>
                <span
                  className={`font-mono text-[10px] tracking-[0.12em] ${style.color}`}
                >
                  {style.label}
                </span>

                <div className="mt-1 text-xs text-[var(--ds-muted)]">
                  {event.authorName}
                </div>
              </div>

              <div className="mt-3 md:mt-0">
                {event.clicked && (
                  <span className="mr-2 inline-block border border-[var(--ds-cyan)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--ds-cyan)]">
                    INPUT
                  </span>
                )}

                {event.text ? (
                  <span className="text-sm leading-6 text-[var(--ds-text)]">
                    {event.text}
                  </span>
                ) : (
                  <span className="font-mono text-xs text-[var(--ds-muted)]">
                    {event.type}
                    {event.subtype
                      ? ` // ${event.subtype}`
                      : ''}
                  </span>
                )}

                {event.role === 'system' &&
                  event.subtype && (
                    <div className="mt-2 font-mono text-[9px] tracking-wider text-[#657879]">
                      {event.type ?? 'system_message'} //{' '}
                      {event.subtype}
                    </div>
                  )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
