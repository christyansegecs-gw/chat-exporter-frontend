import type { Conversation } from '../types'

type Props = {
  conversations: Conversation[]
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR').format(
    new Date(`${value}T12:00:00`),
  )
}

export function ConversationsTable({
  conversations,
}: Props) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
          🔎
        </div>

        <h3 className="mt-4 font-bold text-slate-900">
          Nenhuma conversa encontrada
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Altere os filtros e realize uma nova busca.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Data
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Casa
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Analista
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Tags
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Duração
              </th>

              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Avaliação
              </th>

              <th className="px-5 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {conversations.map((conversation) => (
              <tr
                key={conversation.id}
                className="transition hover:bg-slate-50"
              >
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                  {formatDate(conversation.date)}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                    {conversation.house}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm font-medium text-slate-700">
                  {conversation.agent}
                </td>

                <td className="max-w-md px-5 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {conversation.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                  {formatDuration(
                    conversation.durationSeconds,
                  )}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                  {conversation.rating ?? '—'}
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Abrir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}