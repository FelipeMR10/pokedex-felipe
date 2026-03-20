import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'

/**
 * PokemonCard - Tarjeta individual que muestra la información básica de un Pokémon.
 *
 * Muestra:
 * - Imagen oficial del Pokémon (sprite de la PokeAPI)
 * - Número de la Pokédex (formateado como #001, #025, etc.)
 * - Nombre del Pokémon capitalizado
 *
 * Al hacer clic navega a la página de detalle: /pokemon/:name
 *
 * @param {string} name - Nombre del Pokémon en minúsculas (ej: "pikachu")
 * @param {number} id - Número de la Pokédex (ej: 25)
 */
function PokemonCard({ name, id }) {
  const navigate = useNavigate()

  /**
   * Construye la URL de la imagen oficial del Pokémon.
   * La PokeAPI ofrece sprites en esta URL pública de GitHub.
   * Usamos el ID numérico para obtener el artwork oficial.
   */
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

  /**
   * Formatea el número de la Pokédex con ceros a la izquierda.
   * Ej: 1 → "#001", 25 → "#025", 150 → "#150"
   */
  const formattedId = `#${String(id).padStart(3, '0')}`

  /**
   * Capitaliza la primera letra del nombre del Pokémon.
   * Ej: "pikachu" → "Pikachu"
   */
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)

  /** Navega a la página de detalle del Pokémon al hacer clic en la tarjeta */
  const handleClick = () => {
    navigate(`/pokemon/${name}`)
  }

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        // Efecto hover: la tarjeta sube ligeramente al pasar el mouse
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      {/* CardActionArea hace que toda la tarjeta sea clickeable */}
      <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pt: 2,
            backgroundColor: '#f5f5f5',
          }}
        >
          {/* Imagen oficial del Pokémon */}
          <img
            src={imageUrl}
            alt={capitalizedName}
            style={{ width: 120, height: 120, objectFit: 'contain' }}
            // Si la imagen falla, mostramos un fallback con el sprite normal
            onError={(e) => {
              e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
            }}
          />
        </Box>

        <CardContent sx={{ textAlign: 'center' }}>
          {/* Número de la Pokédex en gris */}
          <Typography variant="caption" color="text.secondary" display="block">
            {formattedId}
          </Typography>

          {/* Nombre del Pokémon en negrita */}
          <Typography variant="h6" component="h2" fontWeight="bold">
            {capitalizedName}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default PokemonCard
