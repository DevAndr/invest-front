import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {useQuery} from "@tanstack/react-query"
import {AnalysisResponse} from "@/app/api/profits/types"

const getAnalysis = async () => {
    const resp = await axiosInstance.get<AnalysisResponse>("/profits/analysis")
    return resp.data
}

export const useGetAnalysis = () => {
    return useQuery({
        queryKey: ["profits", "analysis"],
        queryFn: getAnalysis,
    })
}
