/**
 * pokeApi.js - Servicio de llamadas a la PokeAPI.
 *
 * Contiene todas las funciones que se comunican con https://pokeapi.co/api/v2/
 * Centralizar las llamadas aquí nos permite:
 * 1. Reutilizar la lógica de fetch en cualquier hook o componente
 * 2. Cambiar la URL base en un solo lugar si fuera necesario
 * 3. Manejar errores HTTP de forma consistente
 */

/** URL base de la PokeAPI v2 */
const BASE_URL = 'https://pokeapi.co/api/v2'

/**
 * Obtiene una lista paginada de Pokémon.
 *
 * @param {number} limit - Cantidad de Pokémon a traer por página (default: 20)
 * @param {number} offset - Desde qué posición empezar (default: 0)
 * @returns {Promise<{count: number, results: Array<{name: string, url: string}>}>}
 *   - count: total de Pokémon en la API
 *   - results: array con nombre y URL de cada Pokémon de la página actual
 *
 * Ejemplo de respuesta:
 * {
 *   count: 1302,
 *   results: [
 *     { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
 *     { name: "ivysaur",   url: "https://pokeapi.co/api/v2/pokemon/2/" },
 *     ...
 *   ]
 * }
 */
export async function getPokemonList(limit = 20, offset = 0) {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)

  // Si la respuesta HTTP no es exitosa (ej: 404, 500), lanzamos un error
  if (!response.ok) {
    throw new Error(`Error al obtener la lista de Pokémon: ${response.status}`)
  }

  return response.json()
}

/**
 * Obtiene los datos completos de un Pokémon específico por su nombre.
 *
 * @param {string} name - Nombre del Pokémon en minúsculas (ej: "pikachu", "charizard")
 * @returns {Promise<Object>} Objeto con todos los datos del Pokémon:
 *   - id: número de la Pokédex (ej: 25)
 *   - name: nombre (ej: "pikachu")
 *   - sprites: imágenes del Pokémon (usaremos sprites.other['official-artwork'].front_default)
 *   - moves: array de movimientos que puede aprender
 *   - types: array de tipos (fuego, agua, etc.)
 *   - stats: estadísticas base (hp, ataque, defensa, etc.)
 */
export async function getPokemonDetail(name) {
  const response = await fetch(`${BASE_URL}/pokemon/${name}`)

  // Si el Pokémon no existe o hay un error de red, lanzamos un error descriptivo
  if (!response.ok) {
    throw new Error(`No se encontró el Pokémon "${name}": ${response.status}`)
  }

  return response.json()
}
