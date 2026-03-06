import type {Company} from "@/app/api/companies/types";
import type {FinancialData} from "@/app/api/profits/types";

export type MetricKey = keyof Pick<
    FinancialData,
    "revenue" | "netProfit" | "grossProfit" | "ebitda" | "margin" | "evEbitda" | "roe" | "pe"
>

export const METRICS: { key: MetricKey; label: string; tooltip?: string }[] = [
    {key: "revenue", label: "Выручка"},
    {key: "netProfit", label: "Чистая прибыль"},
    {key: "grossProfit", label: "Валовая прибыль"},
    {
        key: "ebitda",
        label: "EBITDA",
        tooltip: 'операционную прибыль компании до учета процентов, налогов и амортизации'
    },
    {key: "margin", label: "Маржа"},
    {
        key: "evEbitda",
        label: "EV/EBITDA",
        tooltip: 'во сколько рынок оценивает компанию относительно её операционной прибыли'
    },
    {
        key: "roe",
        label: "ROE",
        tooltip: 'насколько эффективно компания использует капитал акционеров для получения прибыли'
    },
    {key: "pe", label: "P/E", tooltip: 'соотношение цена/прибыль'},
]
