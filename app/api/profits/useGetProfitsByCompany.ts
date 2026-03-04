import {FinancialDataResponse} from "@/app/api/profits/types";
import {axiosInstance} from "@/app/api/axios/axiosInstance";
import {useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";

interface Request {
    id: string;
}

const getProfitsByCompany = async ({id}: Request) => {
    const resp = await axiosInstance.get<FinancialDataResponse>(`/companies/${id}/profits`)
    return resp.data
}

export const useGetProfitsByCompanyMutation = () => {
    return useMutation<FinancialDataResponse, AxiosError, Request>({
        mutationFn: getProfitsByCompany
    })
}