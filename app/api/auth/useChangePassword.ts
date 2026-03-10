import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {useMutation} from "@tanstack/react-query"
import {AxiosError} from "axios"

export interface ChangePasswordRequest {
    currentPassword: string
    newPassword: string
}

const changePassword = async (req: ChangePasswordRequest) => {
    const resp = await axiosInstance.patch("/auth/password", req)
    return resp.data
}

export const useChangePassword = () => {
    return useMutation<unknown, AxiosError, ChangePasswordRequest>({
        mutationFn: changePassword,
    })
}
