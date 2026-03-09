import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {useMutation} from "@tanstack/react-query"
import {AxiosError} from "axios"
import {queryClient} from "@/app/layout"

type CompanyInfo = {
    companyName: string
    ticker: string
    industry: string
}

type Request = {
    files: File[]
    companies: CompanyInfo[]
}

type BatchResultItem = {
    company: { id: string; name: string; ticker: string }
    imported: number
    skipped: number
    errors: string[]
}

type Response = {
    results: BatchResultItem[];
    totalFiles: number;
}

const importBatchCSV = async ({files, companies}: Request) => {
    const formData = new FormData()
    files.forEach((file) => formData.append("files", file))
    formData.append("companies", JSON.stringify(companies))

    const resp = await axiosInstance.post<Response>("/import/batch", formData, {
        headers: {"Content-Type": "multipart/form-data"},
    })
    return resp.data
}

export type {BatchResultItem, CompanyInfo}

export const useImportBatchCSV = () => {
    return useMutation<Response, AxiosError, Request>({
        mutationFn: importBatchCSV,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["companies"]})
        },
    })
}
