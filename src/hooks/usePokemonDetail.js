import { useQuery } from '@tanstack/react-query'
import { getPokemonDetail } from '../services/pokeApi'

/**
 * usePokemonDetail - Hook personalizado para obtener el detalle de un Pokémon.
 *
 * Utiliza React Query (useQuery) para:
 * - Hacer el fetch del Pokémon por nombre automáticamente
 * - Cachear el resultado (si volvemos al mismo Pokémon, no refetch)
 * - Exponer los estados: isLoading, isError, data
 *
 * @param {string} name - Nombre del Pokémon en minúsculas (ej: "pikachu")
 *
 * @returns {Object}
 *   - pokemon: objeto completo del Pokémon (id, name, sprites, moves, types, stats)
 *   - isLoading: true mientras se está cargando
 *   - isError: true si hubo un error
 *   - error: objeto de error con el mensaje
 */
export function usePokemonDetail(name) {
  const { data, isLoading, isError, error } = useQuery({
    // queryKey: incluimos el nombre para que cada Pokémon tenga su propia entrada en caché
    queryKey: ['pokemonDetail', name],

    // queryFn: llama al servicio con el nombre recibido
    queryFn: () => getPokemonDetail(name),

    // enabled: solo ejecuta la query si "name" tiene un valor válido.
    // Esto evita llamadas a la API con "undefined" o cadena vacía.
    enabled: Boolean(name),
  })

  return {
    pokemon: data ?? null,
    isLoading,
    isError,
    error,
  }
}
