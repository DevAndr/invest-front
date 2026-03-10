import {axiosInstance} from "@/app/api/axios/axiosInstance"
import {useInfiniteQuery} from "@tanstack/react-query"
import {NewsResponse} from "@/app/api/news/types"

const LIMIT = 10

const getNews = async ({page, search}: {page: number; search?: string}) => {
    const params: Record<string, string | number> = {page, limit: LIMIT}
    if (search) params.search = search
    const resp = await axiosInstance.get<NewsResponse>("/news", {params})
    return resp.data
}

export const useGetNews = (search?: string) => {
    return useInfiniteQuery({
        queryKey: ["news", search],
        queryFn: ({pageParam}) => getNews({page: pageParam, search}),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const {page, totalPages} = lastPage.meta
            return page < totalPages ? page + 1 : undefined
        },
    })
}
