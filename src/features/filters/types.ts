export type Filters = {
  startDate: string
  endDate: string
  houses: string[]
  tags: string[]
  agents: string[]
  tagsMode: 'any' | 'all'
}