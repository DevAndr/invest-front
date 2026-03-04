import {axiosInstance} from "@/app/api/axios/axiosInstance";
import {CompaniesResponse} from "@/app/api/companies/types";
import {useQuery} from "@tanstack/react-query";

type Request = {
    page?: number;
    limit?: number;
    search?: string;
}

type Response = CompaniesResponse;

const getCompanies = async (req: Request) => {
    const resp = await axiosInstance.get<Response>("/companies", {
        params: {
            page: req.page,
            limit: req.limit,
            search: req.search,
        }
    })
    return resp.data;
}

export const useGetCompanies = (req: Request) => {
    return useQuery({
        queryKey: ["companies", req],
        queryFn: () => getCompanies(req)
    })
}