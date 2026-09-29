import { useState } from 'react'
import type { Conversation } from '../types'
import { ConversationTranscript } from './ConversationTranscript'

type Props = {
  conversation?: Conversation
}

function formatDuration(seconds?: number) {
  if (seconds == null) return '—'

  if (seconds < 60) return `${seconds}s`

  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60

  return `${minutes}min${remaining ? ` ${remaining}s` : ''}`
}

function MetadataItem({
  label,
  value,
}: {
  label: string
  value?: string | number | null
}) {
  if (value == null || value === '') return null

  return (
    <div className="border-b border-[var(--ds-line-soft)] py-3">
      <div className="font-mono text-[9px] tracking-[0.14em] text-[var(--ds-muted)]">
        {label}
      </div>

      <div className="mt-1 break-words text-sm text-[var(--ds-text)]">
        {value}
      </div>
    </div>
  )
}

export function ConversationDetail({
  conversation,
}: Props) {
  const [copied, setCopied] = useState(false)

  if (!conversation) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-[var(--ds-bg)] p-10 text-center">
        <div>
          <div className="font-mono text-3xl text-[var(--ds-line)]">
            ◇
          </div>

          <p className="mt-5 font-mono text-xs tracking-[0.15em] text-[var(--ds-muted)]">
            SELECIONE UMA CONVERSA
          </p>
        </div>
      </div>
    )
  }

  const currentConversation = conversation

  async function copyConversation() {
    const header =
      `Atendimento ${currentConversation.id} · ` +
      `${currentConversation.house} · ` +
      `${currentConversation.date} ${currentConversation.startTime} · ` +
      `${currentConversation.agent}`

    const transcript = currentConversation.events
      .map(
        (event) =>
          `${event.time}  ${event.authorName}: ${
            event.text ??
            `[${event.type ?? 'evento'}${
              event.subtype
                ? `/${event.subtype}`
                : ''
            }]`
          }`,
      )
      .join('\n')

    await navigator.clipboard.writeText(
      `${header}\n\n${transcript}`,
    )

    setCopied(true)

    window.setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <main className="min-h-0 overflow-y-auto bg-[var(--ds-bg)] px-6 py-6 lg:px-8">
      <header className="mb-6 border-b border-[var(--ds-line)] pb-5">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <div className="font-mono text-[10px] tracking-[0.18em] text-[var(--ds-gold)]">
              ACTIVE CONNECTION
            </div>

            <h2 className="mt-2 text-2xl font-light tracking-wide">
              ATENDIMENTO // {currentConversation.id}
            </h2>

            <p className="mt-2 font-mono text-xs text-[var(--ds-muted)]">
              {currentConversation.house} ·{' '}
              {currentConversation.date} ·{' '}
              {currentConversation.startTime}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyConversation}
              className="border border-[var(--ds-line)] px-3 py-2 font-mono text-[10px] tracking-wider text-[var(--ds-text)] transition hover:border-[var(--ds-gold)] hover:text-[var(--ds-gold)]"
            >
              {copied
                ? '✓ COPIADO'
                : 'COPIAR CONVERSA'}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="border border-[var(--ds-line)] px-3 py-2 font-mono text-[10px] tracking-wider text-[var(--ds-text)] transition hover:border-[var(--ds-cyan)] hover:text-[var(--ds-cyan)]"
            >
              PDF ↗
            </button>
          </div>
        </div>
      </header>

      <section className="mb-6 border border-[var(--ds-line)] bg-[var(--ds-panel)]">
        <div className="h-[2px] w-16 bg-[var(--ds-gold)]" />

        <div className="p-5">
          <div className="font-mono text-[10px] tracking-[0.18em] text-[var(--ds-gold)]">
            CONNECTION DATA
          </div>

          <h3 className="mt-1 text-base font-normal">
            Dados do atendimento
          </h3>

          <div className="mt-4 grid gap-x-7 md:grid-cols-2 xl:grid-cols-4">
            <MetadataItem
              label="CASA"
              value={currentConversation.house}
            />

            <MetadataItem
              label="ANALISTA"
              value={currentConversation.agent}
            />

            <MetadataItem
              label="EQUIPE"
              value={currentConversation.team}
            />

            <MetadataItem
              label="DURAÇÃO"
              value={formatDuration(
                currentConversation.durationSeconds,
              )}
            />

            <MetadataItem
              label="TME"
              value={formatDuration(
                currentConversation.waitSeconds,
              )}
            />

            <MetadataItem
              label="TMA"
              value={formatDuration(
                currentConversation.serviceSeconds,
              )}
            />

            <MetadataItem
              label="CHAT ID"
              value={currentConversation.chatId}
            />

            <MetadataItem
              label="BOT"
              value={
                currentConversation.bot.participated
                  ? currentConversation.bot.name ?? 'Sim'
                  : 'Não participou'
              }
            />

            <MetadataItem
              label="AVALIAÇÃO"
              value={
                currentConversation.rating === 'good'
                  ? 'Boa'
                  : currentConversation.rating === 'bad'
                    ? 'Ruim'
                    : '—'
              }
            />

            <MetadataItem
              label="RESOLVIDO"
              value={currentConversation.resolved}
            />
          </div>

          <div className="mt-5">
            <div className="font-mono text-[9px] tracking-[0.14em] text-[var(--ds-muted)]">
              TAGS
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {currentConversation.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-[#716040] bg-[#25261e80] px-2 py-1 font-mono text-[10px] text-[var(--ds-gold)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ConversationTranscript
        events={currentConversation.events}
      />
    </main>
  )
}