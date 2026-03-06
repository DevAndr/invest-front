import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {useQuery} from "@tanstack/react-query"
import {PortfolioResponse} from "@/app/api/tinkoff/types"

const getPortfolio = async () => {
    const resp = await axiosInstance.get<PortfolioResponse>("/tinkoff/portfolio")
    return resp.data
}

export const useGetPortfolio = () => {
    return useQuery({
        queryKey: ["tinkoff", "portfolio"],
        queryFn: getPortfolio,
    })
}
