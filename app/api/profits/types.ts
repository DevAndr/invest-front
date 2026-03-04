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

// Константы для проверки типа периода (если нужно расширять в будущем)
enum PeriodType {
    QUARTER= 'QUARTER',
    YEAR= 'YEAR',
    MONTH= 'MONTH'
}