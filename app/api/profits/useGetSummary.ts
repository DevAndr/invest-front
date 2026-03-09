import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {useQuery} from "@tanstack/react-query"

export interface SummaryCompany {
    id: string
    name: string
    ticker: string
}

export interface SummaryLatestPeriod {
    period: string
    revenue: number
    netProfit: number
    margin: number
}

export interface SummaryGrowth {
    revenueYoY: number
    profitYoY: number
}

export interface SummaryResponse {
    company: SummaryCompany
    latestPeriod: SummaryLatestPeriod
    growth: SummaryGrowth
    averageMargin: number
    trend: "growing" | "declining" | "stable"
    totalPeriods: number
}

const getSummary = async (companyId: string) => {
    const resp = await axiosInstance.get<SummaryResponse>(`/profits/summary/${companyId}`)
    return resp.data
}

export const useGetSummary = (companyId: string | null) => {
    return useQuery({
        queryKey: ["summary", companyId],
        queryFn: () => getSummary(companyId!),
        enabled: !!companyId,
    })
}
