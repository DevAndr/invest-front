import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {AxiosError} from "axios"
import {Note} from "@/app/api/notes/types"

type Request = {
    companyId: string
    content: string
}

const createNote = async ({companyId, content}: Request) => {
    const resp = await axiosInstance.post<Note>(`/companies/${companyId}/notes`, {content})
    return resp.data
}

export const useCreateNote = () => {
    const queryClient = useQueryClient()
    return useMutation<Note, AxiosError, Request>({
        mutationFn: createNote,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({queryKey: ["notes", variables.companyId]})
        },
    })
}
