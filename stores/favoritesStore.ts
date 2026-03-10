import {create} from "zustand"
import {persist} from "zustand/middleware"

interface FavoritesStore {
    ids: string[]
    toggle: (id: string) => void
    isFavorite: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesStore>()(
    persist(
        (set, get) => ({
            ids: [],
            toggle: (id) =>
                set((state) => ({
                    ids: state.ids.includes(id)
                        ? state.ids.filter((i) => i !== id)
                        : [...state.ids, id],
                })),
            isFavorite: (id) => get().ids.includes(id),
        }),
        {
            name: "favorites-storage",
            partialize: (state) => ({ids: state.ids}),
        }
    )
)

export const useFavoriteIds = () => useFavoritesStore((s) => s.ids)
export const useToggleFavorite = () => useFavoritesStore((s) => s.toggle)
