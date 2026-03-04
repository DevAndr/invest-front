import {axiosInstance} from "@/app/api/axios/axiosInstance";
import {useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {AuthResponse, RegisterRequest} from "@/app/api/auth/types";

const register = async (req: RegisterRequest) => {
    const resp = await axiosInstance.post<AuthResponse>("/auth/register", req)
    return resp.data
}

export const useRegister = () => {
    return useMutation<AuthResponse, AxiosError, RegisterRequest>({
        mutationFn: register
    })
}
