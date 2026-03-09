import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {Company} from "@/app/api/companies/types"
import {useQuery} from "@tanstack/react-query"

const getCompany = async (id: string) => {
    const resp = await axiosInstance.get<Company>(`/companies/${id}`)
    return resp.data
}

export const useGetCompany = (id: string | null) => {
    return useQuery({
        queryKey: ["company", id],
        queryFn: () => getCompany(id!),
        enabled: !!id,
    })
}
