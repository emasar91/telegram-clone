import { useQuery } from "convex/react"
import { useState } from "react"
import { useDebounce } from "./useDebounce" // Asumo que este es tu hook
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"

export const useUserSearch = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const searchResults = useQuery(
    api.users.searchUsers,
    debouncedSearchTerm.trim() ? { searchTerm: debouncedSearchTerm } : "skip",
  )

  // 1. ¿Está el usuario escribiendo todavía? (El input es diferente al valor procesado)
  const isDebouncing = searchTerm !== debouncedSearchTerm

  // 2. ¿Convex está buscando datos? (El valor procesado existe, pero results es undefined)
  const isFetching =
    searchResults === undefined && debouncedSearchTerm.trim() !== ""

  // El estado de carga real es la suma de ambos
  const isLoading = isDebouncing || isFetching

  return {
    searchTerm,
    setSearchTerm,
    searchResults: searchResults || ([] as Doc<"users">[]),
    isLoading,
  }
}
