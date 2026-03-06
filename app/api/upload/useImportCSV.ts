import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {useMutation} from "@tanstack/react-query"
import {AxiosError} from "axios"

type Request = {
    file: File
    companyName: string
    ticker: string
    industry: string
}

type Response = ImportResult

const importCSV = async ({file, companyName, ticker, industry}: Request) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("companyName", companyName)
    formData.append("ticker", ticker)
    formData.append("industry", industry)

    const resp = await axiosInstance.post<Response>("/import/csv", formData, {
        headers: {"Content-Type": "multipart/form-data"},
    })
    return resp.data
}

export const useImportCSV = () => {
    return useMutation<Response, AxiosError, Request>({
        mutationFn: importCSV,
    })
}
