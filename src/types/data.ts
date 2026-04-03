export interface DataEntryItem {
  name: string
  order: number
}

export interface DataEntry {
  title: string
  description: string
  items: DataEntryItem[]
}