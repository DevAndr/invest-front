import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {AxiosError} from "axios"

type Request = {
    companyId: string
    noteId: string
}

const deleteNote = async ({noteId}: Request) => {
    await axiosInstance.delete(`/notes/${noteId}`)
}

export const useDeleteNote = () => {
    const queryClient = useQueryClient()
    return useMutation<void, AxiosError, Request>({
        mutationFn: deleteNote,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({queryKey: ["notes", variables.companyId]})
        },
    })
}
