// Основной тип для элемента финансовых данных
export interface FinancialData {
    id: string;
    companyId: string;
    period: string;
    periodType: PeriodType;
    revenue: number;
    netProfit: number;
    grossProfit: number;
    ebitda: number;
    margin: number;
    evEbitda: number;
    roe: number;
    pe: number;
    periodLabel: number;
    createdAt: string;
}

// Тип для всего ответа (массив финансовых данных)
export type FinancialDataResponse = FinancialData[];

export interface MetricsCompany {
    id: string
    name: string
    ticker: string
}

export interface MetricsData {
    revenue: (number | null)[]
    netProfit: (number | null)[]
    grossProfit: (number | null)[]
    ebitda: (number | null)[]
    margin: (number | null)[]
    evEbitda: (number | null)[]
    roe: (number | null)[]
    pe: (number | null)[]
}

export interface MetricsResponse {
    company: MetricsCompany
    periods: string[]
    metrics: MetricsData
}

export type MetricStatus = "excellent" | "good" | "normal" | "poor" | "critical"

export interface MetricAnalysis {
    value: number
    status: MetricStatus
    description: string
}

export interface CompanyAnalysis {
    companyId: string
    companyName: string
    ticker: string
    industry: string
    periodType: string
    period: string
    logo?: string;
    metrics: {
        revenue: MetricAnalysis
        netProfit: MetricAnalysis
        grossProfit: MetricAnalysis
        ebitda: MetricAnalysis
        margin: MetricAnalysis
        evEbitda: MetricAnalysis
        roe: MetricAnalysis
        pe: MetricAnalysis
    }
}

export type AnalysisResponse = CompanyAnalysis[]

// Константы для проверки типа периода (если нужно расширять в будущем)
enum PeriodType {
    QUARTER= 'QUARTER',
    YEAR= 'YEAR',
    MONTH= 'MONTH'
}