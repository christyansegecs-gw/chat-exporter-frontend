import { useState } from 'react'
import type { Conversation } from '../types'
import { ConversationDetail } from './ConversationDetail'
import { ConversationSidebar } from './ConversationSidebar'

type Props = {
  conversations: Conversation[]
}

export function ConversationWorkspace({
  conversations,
}: Props) {
  const [selectedId, setSelectedId] =
    useState<string | undefined>(
      conversations[0]?.id,
    )

  const activeSelectedId =
    selectedId &&
    conversations.some(
      (conversation) =>
        conversation.id === selectedId,
    )
      ? selectedId
      : conversations[0]?.id

  const selectedConversation =
    conversations.find(
      (conversation) =>
        conversation.id === activeSelectedId,
    )

  if (conversations.length === 0) {
    return (
      <div className="flex min-h-[500px] items-center justify-center border border-[var(--ds-line)] bg-[var(--ds-panel)]">
        <div className="text-center">
          <span className="font-mono text-3xl text-[var(--ds-line)]">
            ◇
          </span>

          <h3 className="mt-5 font-mono text-xs tracking-[0.16em] text-[var(--ds-text)]">
            NENHUMA CONEXÃO ENCONTRADA
          </h3>

          <p className="mt-2 text-sm text-[var(--ds-muted)]">
            Ajuste os filtros e tente novamente.
          </p>
        </div>
      </div>
    )
  }

  return (
    <section className="grid min-h-[680px] overflow-hidden border border-[var(--ds-line)] lg:h-[760px] lg:grid-cols-[340px_minmax(0,1fr)]">
      <ConversationSidebar
        conversations={conversations}
        selectedId={activeSelectedId}
        onSelect={(conversation) =>
          setSelectedId(conversation.id)
        }
      />

      <ConversationDetail
        conversation={selectedConversation}
      />
    </section>
  )
}