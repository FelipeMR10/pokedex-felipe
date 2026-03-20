import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PokemonDetailPage from './pages/PokemonDetailPage'

/**
 * App.jsx - Componente raíz de la PokéDex Felipe.
 *
 * Define las rutas principales de la aplicación usando React Router:
 * - "/" → HomePage: muestra la lista de Pokémon con búsqueda y paginación
 * - "/pokemon/:name" → PokemonDetailPage: muestra el detalle de un Pokémon específico
 *
 * El parámetro ":name" es dinámico, por ejemplo: /pokemon/pikachu
 */
function App() {
  return (
    <Routes>
      {/* Ruta principal: lista de Pokémon */}
      <Route path="/" element={<HomePage />} />

      {/* Ruta de detalle: recibe el nombre del Pokémon como parámetro de URL */}
      <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
    </Routes>
  )
}

export default App
