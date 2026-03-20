import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'

/**
 * SearchBar - Barra de búsqueda para filtrar Pokémon por nombre.
 *
 * Es un componente controlado: el estado del texto vive en el componente padre
 * (HomePage) y se pasa aquí mediante props. Esto permite que HomePage filtre
 * la lista de Pokémon según lo que el usuario escribe.
 *
 * @param {string} value - Texto actual del campo de búsqueda
 * @param {Function} onChange - Función que se llama cada vez que el usuario escribe
 */
function SearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Buscar Pokémon por nombre..."
      value={value}
      onChange={onChange}
      // Ícono de lupa al inicio del campo
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        mb: 3,
        backgroundColor: 'white',
        borderRadius: 1,
      }}
    />
  )
}

export default SearchBar
