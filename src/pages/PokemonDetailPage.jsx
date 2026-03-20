import { useParams, useNavigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { usePokemonDetail } from '../hooks/usePokemonDetail'

/**
 * Colores de fondo para cada tipo de Pokémon.
 * Se usan para darle el color temático a la página según el tipo del Pokémon.
 */
const TYPE_COLORS = {
  fire: '#FF9800',
  water: '#2196F3',
  grass: '#4CAF50',
  electric: '#FFEB3B',
  psychic: '#E91E63',
  ice: '#80DEEA',
  dragon: '#7B1FA2',
  dark: '#424242',
  fairy: '#F48FB1',
  normal: '#BDBDBD',
  fighting: '#BF360C',
  flying: '#90CAF9',
  poison: '#9C27B0',
  ground: '#EFEBE9',
  rock: '#795548',
  bug: '#8BC34A',
  ghost: '#4527A0',
  steel: '#607D8B',
}

/**
 * PokemonDetailPage - Página de detalle de un Pokémon específico.
 *
 * Obtiene el nombre del Pokémon desde los parámetros de la URL (:name)
 * y usa el hook usePokemonDetail para cargar sus datos desde la PokeAPI.
 *
 * Layout (diseño):
 * - Columna izquierda: nombre, número, tipos y lista de movimientos
 * - Columna derecha: imagen grande del artwork oficial
 *
 * @uses useParams - Para obtener el parámetro :name de la URL
 * @uses useNavigate - Para el botón "Volver a la lista"
 * @uses usePokemonDetail - Hook que carga los datos del Pokémon
 */
function PokemonDetailPage() {
  // Extraemos el parámetro "name" de la URL (ej: /pokemon/pikachu → name = "pikachu")
  const { name } = useParams()

  // Hook de navegación programática (para el botón de volver)
  const navigate = useNavigate()

  // Cargamos los datos del Pokémon usando React Query
  const { pokemon, isLoading, isError, error } = usePokemonDetail(name)

  /** Navega de vuelta a la lista principal */
  const handleGoBack = () => {
    navigate('/')
  }

  // --- Estado de carga ---
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={80} />
      </Box>
    )
  }

  // --- Estado de error ---
  if (isError) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack} variant="contained">
          Volver a la lista
        </Button>
      </Container>
    )
  }

  // Si no hay datos aún, no renderizamos nada
  if (!pokemon) return null

  /**
   * Obtenemos el color de fondo según el primer tipo del Pokémon.
   * Si el tipo no está en nuestro diccionario, usamos gris como fallback.
   */
  const primaryType = pokemon.types[0]?.type.name
  const bgColor = TYPE_COLORS[primaryType] ?? '#BDBDBD'

  /**
   * URL de la imagen oficial del Pokémon (artwork de alta calidad).
   * Fallback al sprite normal si el artwork no está disponible.
   */
  const imageUrl =
    pokemon.sprites?.other?.['official-artwork']?.front_default ??
    pokemon.sprites?.front_default

  /**
   * Formatea el número de la Pokédex con ceros a la izquierda.
   * Ej: 25 → "#025"
   */
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`

  /**
   * Capitaliza la primera letra del nombre.
   * Ej: "pikachu" → "Pikachu"
   */
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: bgColor, py: 4 }}>
      <Container maxWidth="lg">

        {/* Botón para volver a la lista */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          variant="contained"
          color="inherit"
          sx={{ mb: 3, backgroundColor: 'rgba(255,255,255,0.8)' }}
        >
          Volver a la lista
        </Button>

        <Grid container spacing={4} alignItems="flex-start">

          {/* ===== COLUMNA IZQUIERDA: Información y movimientos ===== */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>

              {/* Nombre y número */}
              <Typography variant="caption" color="text.secondary" fontSize={16}>
                {formattedId}
              </Typography>
              <Typography variant="h3" fontWeight="bold" mb={2}>
                {capitalizedName}
              </Typography>

              {/* Tipos del Pokémon como chips de colores */}
              <Box display="flex" gap={1} mb={3}>
                {pokemon.types.map(({ type }) => (
                  <Chip
                    key={type.name}
                    label={type.name.toUpperCase()}
                    sx={{
                      backgroundColor: TYPE_COLORS[type.name] ?? '#BDBDBD',
                      color: 'white',
                      fontWeight: 'bold',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  />
                ))}
              </Box>

              {/* Lista de movimientos */}
              <Typography variant="h5" fontWeight="bold" mb={1}>
                Movimientos ({pokemon.moves.length})
              </Typography>

              <Paper
                variant="outlined"
                sx={{ maxHeight: 400, overflowY: 'auto', borderRadius: 2 }}
              >
                <List dense>
                  {pokemon.moves.map(({ move }, index) => (
                    <Box key={move.name}>
                      <ListItem>
                        <ListItemText
                          primary={
                            // Formateamos el nombre: "thunderbolt" → "Thunderbolt"
                            move.name
                              .split('-')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')
                          }
                        />
                      </ListItem>
                      {/* Divisor entre items (excepto el último) */}
                      {index < pokemon.moves.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </Paper>
            </Paper>
          </Grid>

          {/* ===== COLUMNA DERECHA: Imagen grande ===== */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: 4,
                p: 3,
              }}
            >
              <img
                src={imageUrl}
                alt={capitalizedName}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  height: 'auto',
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
                }}
              />
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}

export default PokemonDetailPage
