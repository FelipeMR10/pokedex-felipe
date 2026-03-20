import MuiPagination from '@mui/material/Pagination'
import Box from '@mui/material/Box'

/**
 * Pagination - Componente de paginación para navegar entre páginas de Pokémon.
 *
 * Calcula el total de páginas y renderiza el componente Pagination de MUI.
 * Cuando el usuario hace clic en un número de página, notifica al componente
 * padre (HomePage) para que actualice el estado y haga un nuevo fetch.
 *
 * @param {number} currentPage - Página actualmente seleccionada
 * @param {number} totalCount - Total de Pokémon en la API (para calcular páginas)
 * @param {number} itemsPerPage - Pokémon por página (default: 20)
 * @param {Function} onPageChange - Callback que recibe el nuevo número de página
 */
function Pagination({ currentPage, totalCount, itemsPerPage = 20, onPageChange }) {
  /**
   * Calcula el número total de páginas.
   * Math.ceil asegura que si hay resto, se crea una página extra.
   * Ej: 1302 pokémon / 20 por página = 65.1 → 66 páginas
   */
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  /**
   * Manejador del cambio de página.
   * MUI Pagination llama a onChange con (event, value) donde value es el número de página.
   * Solo necesitamos el valor, no el evento.
   *
   * @param {React.ChangeEvent} _ - Evento (no lo usamos)
   * @param {number} newPage - Nueva página seleccionada
   */
  const handleChange = (_, newPage) => {
    onPageChange(newPage)
    // Scroll suave hacia arriba al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box display="flex" justifyContent="center" mt={4} mb={2}>
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
      />
    </Box>
  )
}

export default Pagination
