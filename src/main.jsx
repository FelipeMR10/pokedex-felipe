import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './index.css'

/**
 * Configuración de React Query.
 * QueryClient maneja el caché de todas las peticiones a la PokeAPI.
 * - staleTime: los datos se consideran frescos por 5 minutos (no refetch innecesario)
 * - retry: si falla una petición, reintenta 1 vez antes de mostrar error
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
})

/**
 * Punto de entrada de la aplicación PokéDex Felipe.
 * Envolvemos la app con:
 * 1. QueryClientProvider → habilita React Query en toda la app
 * 2. BrowserRouter → habilita React Router para navegación entre páginas
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
