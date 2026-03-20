import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import PokemonCard from './PokemonCard'

/**
 * PokemonList - Grilla responsiva que muestra la lista de Pokémon.
 *
 * Recibe el array de Pokémon (ya filtrado por búsqueda) y los renderiza
 * usando PokemonCard. La grilla es responsiva:
 * - Móvil (xs): 2 columnas
 * - Tablet (sm): 3 columnas
 * - Desktop (md+): 4 columnas
 *
 * @param {Array} pokemonList - Array de objetos { name, url } de los Pokémon a mostrar
 */
function PokemonList({ pokemonList }) {
  /**
   * Extrae el ID numérico del Pokémon a partir de su URL de la PokeAPI.
   * Ejemplo de URL: "https://pokeapi.co/api/v2/pokemon/25/"
   * Resultado: 25
   *
   * @param {string} url - URL del Pokémon en la PokeAPI
   * @returns {number} ID numérico del Pokémon
   */
  const getIdFromUrl = (url) => {
    // La URL termina en "/25/" → dividimos por "/" y tomamos el penúltimo elemento
    const parts = url.split('/')
    return parseInt(parts[parts.length - 2])
  }

  // Si no hay Pokémon (búsqueda sin resultados), mostramos mensaje informativo
  if (pokemonList.length === 0) {
    return (
      <Typography variant="h6" textAlign="center" color="text.secondary" mt={4}>
        No se encontraron Pokémon con ese nombre.
      </Typography>
    )
  }

  return (
    <Grid container spacing={2}>
      {pokemonList.map((pokemon) => {
        const pokemonId = getIdFromUrl(pokemon.url)

        return (
          <Grid
            key={pokemon.name}
            size={{ xs: 6, sm: 4, md: 3 }}
          >
            <PokemonCard name={pokemon.name} id={pokemonId} />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default PokemonList
