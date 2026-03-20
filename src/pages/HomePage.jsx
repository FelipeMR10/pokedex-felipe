import { useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import SearchBar from '../components/SearchBar'
import PokemonList from '../components/PokemonList'
import Pagination from '../components/Pagination'
import { usePokemonList } from '../hooks/usePokemonList'

/**
 * HomePage - Página principal de la PokéDex Felipe.
 *
 * Esta página es el corazón de la aplicación. Maneja tres estados locales:
 * - searchTerm: texto ingresado en la barra de búsqueda
 * - currentPage: página actual de la paginación
 *
 * Flujo de datos:
 * 1. usePokemonList(currentPage) → trae 20 pokémon de la página actual
 * 2. SearchBar filtra los resultados localmente por nombre
 * 3. PokemonList renderiza las tarjetas filtradas
 * 4. Pagination permite cambiar de página
 *
 * Nota sobre el filtrado por búsqueda:
 * La PokeAPI no tiene endpoint de búsqueda parcial por nombre, por lo que
 * filtramos los resultados de la página actual en el cliente. Para buscar
 * en todos los pokémon sería necesario cargar la lista completa.
 */
function HomePage() {
  /** Texto de búsqueda ingresado por el usuario */
  const [searchTerm, setSearchTerm] = useState('')

  /** Página actual de la paginación (empieza en 1) */
  const [currentPage, setCurrentPage] = useState(1)

  // Obtenemos la lista de pokémon para la página actual usando React Query
  const { pokemonList, totalCount, isLoading, isError, error } = usePokemonList(currentPage)

  /**
   * Filtra la lista de Pokémon según el término de búsqueda.
   * La comparación es case-insensitive (insensible a mayúsculas).
   * Si no hay término de búsqueda, devuelve la lista completa.
   */
  const filteredPokemon = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  )

  /**
   * Manejador del cambio en la barra de búsqueda.
   * Actualiza el término de búsqueda y reinicia la paginación a la página 1
   * para evitar estados inconsistentes (estar en página 3 con resultados filtrados).
   */
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  /**
   * Manejador del cambio de página desde el componente Pagination.
   * Limpia la búsqueda al cambiar de página para mostrar todos los pokémon.
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    setSearchTerm('')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Encabezado de la PokéDex */}
        <Typography
          variant="h3"
          component="h1"
          textAlign="center"
          fontWeight="bold"
          color="primary"
          mb={1}
        >
          PokéDex Felipe
        </Typography>
        <Typography
          variant="subtitle1"
          textAlign="center"
          color="text.secondary"
          mb={4}
        >
          Explora el mundo Pokémon
        </Typography>

        {/* Barra de búsqueda */}
        <SearchBar value={searchTerm} onChange={handleSearchChange} />

        {/* Estado de carga: mostramos spinner mientras React Query hace el fetch */}
        {isLoading && (
          <Box display="flex" justifyContent="center" mt={6}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Estado de error: mostramos mensaje si la petición falla */}
        {isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error al cargar los Pokémon: {error?.message}
          </Alert>
        )}

        {/* Lista de Pokémon (solo si no está cargando y no hay error) */}
        {!isLoading && !isError && (
          <>
            <PokemonList pokemonList={filteredPokemon} />

            {/* Paginación: solo se muestra si no hay búsqueda activa */}
            {!searchTerm && (
              <Pagination
                currentPage={currentPage}
                totalCount={totalCount}
                itemsPerPage={20}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </Container>
    </Box>
  )
}

export default HomePage
