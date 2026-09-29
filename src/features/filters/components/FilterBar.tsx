import type { Filters } from '../types'

type Props = {
  value: Filters
  onChange: (filters: Filters) => void
  onSearch: () => void
  housesOptions?: string[]
  tagsOptions?: string[]
  agentsOptions?: string[]
}

function toggleValue(current: string[], item: string) {
  return current.includes(item)
    ? current.filter((value) => value !== item)
    : [...current, item]
}

export function FilterBar({
  value,
  onChange,
  onSearch,
  housesOptions = [],
  tagsOptions = [],
  agentsOptions = [],
}: Props) {
  function clearFilters() {
    onChange({
      startDate: '',
      endDate: '',
      houses: [],
      tags: [],
      agents: [],
      tagsMode: 'any',
    })
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-lg font-bold">
            Filtros
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Defina o recorte de conversas que deseja analisar.
          </p>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="self-start text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          Limpar filtros
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Data inicial
          </span>

          <input
            type="date"
            value={value.startDate}
            onChange={(event) =>
              onChange({
                ...value,
                startDate: event.target.value,
              })
            }
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Data final
          </span>

          <input
            type="date"
            value={value.endDate}
            onChange={(event) =>
              onChange({
                ...value,
                endDate: event.target.value,
              })
            }
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Casa
          </span>

          <select
            value={value.houses[0] ?? ''}
            onChange={(event) =>
              onChange({
                ...value,
                houses: event.target.value
                  ? [event.target.value]
                  : [],
              })
            }
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="">Todas as casas</option>

            {housesOptions.map((house) => (
              <option key={house} value={house}>
                {house}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Analista
          </span>

          <select
            value={value.agents[0] ?? ''}
            onChange={(event) =>
              onChange({
                ...value,
                agents: event.target.value
                  ? [event.target.value]
                  : [],
              })
            }
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="">Todos os analistas</option>

            {agentsOptions.map((agent) => (
              <option key={agent} value={agent}>
                {agent}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tags
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  tagsMode: 'any',
                })
              }
              className={
                value.tagsMode === 'any'
                  ? 'rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-semibold text-white'
                  : 'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600'
              }
            >
              Qualquer
            </button>

            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  tagsMode: 'all',
                })
              }
              className={
                value.tagsMode === 'all'
                  ? 'rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-semibold text-white'
                  : 'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-600'
              }
            >
              Todas
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {tagsOptions.map((tag) => {
            const selected = value.tags.includes(tag)

            return (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    tags: toggleValue(value.tags, tag),
                  })
                }
                className={
                  selected
                    ? 'rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition'
                    : 'rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50'
                }
              >
                {selected && '✓ '}
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-end border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={onSearch}
          className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
        >
          Buscar conversas
        </button>
      </div>
    </section>
  )
}