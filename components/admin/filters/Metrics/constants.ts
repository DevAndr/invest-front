import type {Company} from "@/app/api/companies/types";
import type {FinancialData} from "@/app/api/profits/types";

export type MetricKey = keyof Pick<
    FinancialData,
    "revenue" | "netProfit" | "grossProfit" | "ebitda" | "margin" | "evEbitda" | "roe" | "pe"
>

export const METRICS: {key: MetricKey; label: string}[] = [
    {key: "revenue", label: "Выручка"},
    {key: "netProfit", label: "Чистая прибыль"},
    {key: "grossProfit", label: "Валовая прибыль"},
    {key: "ebitda", label: "EBITDA"},
    {key: "margin", label: "Маржа"},
    {key: "evEbitda", label: "EV/EBITDA"},
    {key: "roe", label: "ROE"},
    {key: "pe", label: "P/E"},
]
