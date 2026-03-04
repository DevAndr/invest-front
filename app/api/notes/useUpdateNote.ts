import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {AxiosError} from "axios"
import {Note} from "@/app/api/notes/types"

type Request = {
    companyId: string
    noteId: string
    content?: string
}

const updateNote = async ({noteId, content}: Request) => {
    const resp = await axiosInstance.patch<Note>(`/notes/${noteId}`, {content})
    return resp.data
}

export const useUpdateNote = () => {
    const queryClient = useQueryClient()
    return useMutation<Note, AxiosError, Request>({
        mutationFn: updateNote,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({queryKey: ["notes", variables.companyId]})
        },
    })
}
