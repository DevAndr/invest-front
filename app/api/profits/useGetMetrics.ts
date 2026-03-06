import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {useQuery} from "@tanstack/react-query"
import {MetricsResponse} from "@/app/api/profits/types"

const getMetrics = async (companyId: string) => {
    const resp = await axiosInstance.get<MetricsResponse>(`/profits/metrics/${companyId}`)
    return resp.data
}

export const useGetMetrics = (companyId: string | null) => {
    return useQuery({
        queryKey: ["metrics", companyId],
        queryFn: () => getMetrics(companyId!),
        enabled: !!companyId,
    })
}
