export interface NewsItem {
    title: string
    url: string
    description: string | null
    publishedAt: string
    category: string | null
    image: string | null
}

export interface NewsMeta {
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface NewsResponse {
    data: NewsItem[]
    meta: NewsMeta
}
