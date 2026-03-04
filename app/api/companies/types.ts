export interface Company {
    id: string;
    name: string;
    ticker: string;
    industry: string;
    country: string;
    logo: string | null;
    createdAt: string; // или Date, если вы парсите даты
    updatedAt: string; // или Date, если вы парсите даты
}

// Тип для мета-информации пагинации
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Основной тип ответа API
export interface CompaniesResponse {
    data: Company[];
    meta: PaginationMeta;
}