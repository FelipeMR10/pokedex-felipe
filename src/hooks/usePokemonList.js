import { useQuery } from '@tanstack/react-query'
import { getPokemonList } from '../services/pokeApi'

/**
 * usePokemonList - Hook personalizado para obtener la lista paginada de Pokémon.
 *
 * Utiliza React Query (useQuery) para:
 * - Hacer el fetch automáticamente al montar el componente
 * - Cachear los resultados (evita refetch innecesario al volver a la misma página)
 * - Exponer los estados: isLoading, isError, data
 *
 * @param {number} page - Página actual (comienza en 1)
 * @param {number} limit - Pokémon por página (default: 20)
 *
 * @returns {Object}
 *   - pokemonList: array de { name, url } de los Pokémon de la página actual
 *   - totalCount: total de Pokémon en la API (para calcular páginas totales)
 *   - isLoading: true mientras se está cargando
 *   - isError: true si hubo un error en la petición
 *   - error: objeto de error con el mensaje
 */
export function usePokemonList(page = 1, limit = 20) {
  // Calculamos el offset: página 1 → offset 0, página 2 → offset 20, etc.
  const offset = (page - 1) * limit

  const { data, isLoading, isError, error } = useQuery({
    // queryKey: identifica esta query en el caché.
    // Cuando cambia "page" o "limit", React Query hace un nuevo fetch automáticamente.
    queryKey: ['pokemonList', page, limit],

    // queryFn: la función que hace el fetch real
    queryFn: () => getPokemonList(limit, offset),
  })

  return {
    pokemonList: data?.results ?? [],   // Array de pokémon de la página actual
    totalCount: data?.count ?? 0,       // Total de pokémon (para calcular páginas)
    isLoading,
    isError,
    error,
  }
}
