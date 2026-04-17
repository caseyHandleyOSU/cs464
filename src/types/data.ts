export interface DatasetItem {
    name: string
    order: number
}

export interface DatasetDatabaseItem {
    item_name: string
    item_order: number
}

export interface Dataset<T = DatasetItem> {
    id: number
    dataset_slug?: string
    title: string
    description: string | null
    items: T[]
}