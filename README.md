# PokéDex Felipe

Aplicación web de tipo PokéDex construida con React, que consume la [PokeAPI](https://pokeapi.co/) para listar, buscar y consultar el detalle de cualquier Pokémon. El proyecto sirve como referencia práctica de arquitectura React moderna con separación de responsabilidades en capas: servicios → hooks → componentes → páginas.

---

## Tabla de contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Requisitos previos](#requisitos-previos)
3. [Instalación y ejecución](#instalación-y-ejecución)
4. [Arquitectura del proyecto](#arquitectura-del-proyecto)
5. [Capa de servicios](#capa-de-servicios)
6. [Capa de hooks](#capa-de-hooks)
7. [Capa de componentes](#capa-de-componentes)
8. [Capa de páginas](#capa-de-páginas)
9. [Punto de entrada y configuración global](#punto-de-entrada-y-configuración-global)
10. [Flujo de datos completo](#flujo-de-datos-completo)
11. [Despliegue en GitHub Pages](#despliegue-en-github-pages)

---

## Stack tecnológico

| Tecnología | Versión | Rol en el proyecto |
|---|---|---|
| [React](https://react.dev/) | ^19 | Librería de UI, manejo de estado local con `useState` |
| [Vite](https://vite.dev/) | ^8 | Build tool y servidor de desarrollo con HMR |
| [React Router DOM](https://reactrouter.com/) | ^7 | Navegación SPA entre páginas sin recarga |
| [TanStack React Query](https://tanstack.com/query/v4) | ^5 | Fetching, caché y estados de servidor (loading/error/data) |
| [Material UI (MUI)](https://mui.com/) | ^7 | Sistema de componentes visuales con diseño Material Design |
| [PokeAPI](https://pokeapi.co/docs/v2) | v2 | API REST pública y gratuita con datos de todos los Pokémon |

---

## Requisitos previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- Conexión a internet (la app consume la PokeAPI en tiempo real)

Verificar versiones instaladas:

```bash
node --version
npm --version
```

---

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/pokedex-felipe.git
cd pokedex-felipe

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| Desarrollo | `npm run dev` | Inicia Vite con HMR (Hot Module Replacement) |
| Build | `npm run build` | Compila y optimiza para producción en `/dist` |
| Preview | `npm run preview` | Sirve el build de producción localmente |
| Lint | `npm run lint` | Ejecuta ESLint sobre el código fuente |
| Predeploy | `npm run predeploy` | Ejecuta el build antes del deploy (automático) |
| Deploy | `npm run deploy` | Publica en GitHub Pages via `gh-pages` |

---

## Arquitectura del proyecto

```
pokedex-felipe/
├── public/                    # Archivos estáticos servidos tal cual
├── src/
│   ├── services/              # CAPA 1: Comunicación con la API externa
│   │   └── pokeApi.js         # Funciones fetch puras hacia la PokeAPI
│   │
│   ├── hooks/                 # CAPA 2: Lógica de estado del servidor
│   │   ├── usePokemonList.js  # React Query: lista paginada de Pokémon
│   │   └── usePokemonDetail.js# React Query: detalle de un Pokémon
│   │
│   ├── components/            # CAPA 3: Componentes reutilizables de UI
│   │   ├── SearchBar.jsx      # Campo de texto para filtrar por nombre
│   │   ├── PokemonCard.jsx    # Tarjeta individual de un Pokémon
│   │   ├── PokemonList.jsx    # Grilla responsiva de PokemonCards
│   │   └── Pagination.jsx     # Navegación entre páginas de resultados
│   │
│   ├── pages/                 # CAPA 4: Vistas completas (una por ruta)
│   │   ├── HomePage.jsx       # Ruta "/": lista + búsqueda + paginación
│   │   └── PokemonDetailPage.jsx # Ruta "/pokemon/:name": detalle completo
│   │
│   ├── App.jsx                # Definición de rutas (React Router)
│   ├── main.jsx               # Punto de entrada: proveedores globales
│   └── index.css              # Reset CSS global
│
├── package.json
├── vite.config.js
└── README.md
```

### Principio de capas

Cada capa solo conoce a la capa inmediatamente inferior. Las páginas usan hooks, los hooks usan servicios, los servicios usan `fetch`. Ninguna capa salta a otra capa inferior directamente.

```
Páginas  →  Hooks  →  Servicios  →  PokeAPI
   ↕
Componentes (reciben datos como props desde las páginas)
```

---

## Capa de servicios

### `src/services/pokeApi.js`

**Responsabilidad única:** hacer las llamadas HTTP a la PokeAPI y retornar los datos parseados como JSON. No conoce React, no conoce hooks, no conoce componentes.

#### Constante base

```js
const BASE_URL = 'https://pokeapi.co/api/v2'
```

Centralizar la URL base permite cambiarla en un solo lugar si la API cambia de dominio o versión.

---

#### `getPokemonList(limit, offset)`

Obtiene una página de Pokémon de la API.

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `limit` | `number` | `20` | Cuántos Pokémon traer |
| `offset` | `number` | `0` | Desde qué posición de la lista empezar |

**Endpoint consumido:**
```
GET https://pokeapi.co/api/v2/pokemon?limit=20&offset=0
```

**Respuesta de la API (simplificada):**
```json
{
  "count": 1302,
  "results": [
    { "name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/" },
    { "name": "ivysaur",   "url": "https://pokeapi.co/api/v2/pokemon/2/" }
  ]
}
```

- `count`: total de Pokémon en la API (usado para calcular páginas en `Pagination`)
- `results`: array de la página actual, cada item tiene `name` y `url`
- La `url` de cada Pokémon contiene su ID numérico (ej: `.../pokemon/1/` → ID `1`)

**Manejo de error:** si `response.ok` es `false` (códigos HTTP 4xx o 5xx), lanza un `Error` con el código de estado. React Query captura este error y lo expone en el estado `isError`.

---

#### `getPokemonDetail(name)`

Obtiene todos los datos de un Pokémon específico.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `name` | `string` | Nombre en minúsculas (ej: `"pikachu"`, `"charizard"`) |

**Endpoint consumido:**
```
GET https://pokeapi.co/api/v2/pokemon/pikachu
```

**Campos relevantes de la respuesta que usa la aplicación:**

| Campo en la respuesta | Usado en | Para qué |
|---|---|---|
| `id` | `PokemonDetailPage` | Número de Pokédex (#025) |
| `name` | `PokemonDetailPage` | Nombre para mostrar |
| `sprites.other['official-artwork'].front_default` | `PokemonDetailPage` | Imagen de alta calidad |
| `sprites.front_default` | `PokemonDetailPage` | Imagen fallback si falla el artwork |
| `types[].type.name` | `PokemonDetailPage` | Tipo(s) del Pokémon (fuego, agua, etc.) |
| `moves[].move.name` | `PokemonDetailPage` | Lista de movimientos |

---

## Capa de hooks

Los hooks encapsulan la integración con React Query. El beneficio es que los componentes no saben cómo se hace el fetching: solo reciben `{ data, isLoading, isError }`.

### `src/hooks/usePokemonList.js`

**Responsabilidad:** obtener la lista paginada de Pokémon para la página actual y exponer los estados de React Query.

#### Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `page` | `number` | `1` | Página actual (base 1, no base 0) |
| `limit` | `number` | `20` | Pokémon por página |

#### Cálculo del offset

```js
const offset = (page - 1) * limit
```

React Query necesita saber cuándo debe hacer un nuevo fetch. Lo determina por la `queryKey`.

#### `queryKey`

```js
queryKey: ['pokemonList', page, limit]
```

Cada combinación única de `[page, limit]` tiene su propio registro en el caché. Al cambiar de página, React Query detecta que la key cambió y hace un nuevo fetch. Si el usuario regresa a una página ya visitada, devuelve el resultado del caché sin llamar a la API.

#### Valores retornados

| Propiedad | Tipo | Descripción |
|---|---|---|
| `pokemonList` | `Array` | Array de `{ name, url }` de la página actual. Vacío `[]` mientras carga. |
| `totalCount` | `number` | Total de Pokémon en la API. `0` mientras carga. |
| `isLoading` | `boolean` | `true` durante el primer fetch (sin caché). |
| `isError` | `boolean` | `true` si la petición falló. |
| `error` | `Error \| null` | Objeto de error con `.message`. `null` si no hay error. |

---

### `src/hooks/usePokemonDetail.js`

**Responsabilidad:** obtener todos los datos de un Pokémon por nombre.

#### Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `name` | `string` | Nombre del Pokémon (viene de `useParams()` en la página) |

#### `queryKey`

```js
queryKey: ['pokemonDetail', name]
```

Cada Pokémon tiene su propia entrada en el caché. Si el usuario visita Pikachu, vuelve a la lista y vuelve a Pikachu, el segundo render es instantáneo (desde caché).

#### Opción `enabled`

```js
enabled: Boolean(name)
```

Previene que React Query ejecute la query si `name` es `undefined`, `null` o cadena vacía. Esto sucedería si el componente se monta antes de que los parámetros de URL estén disponibles.

#### Valores retornados

| Propiedad | Tipo | Descripción |
|---|---|---|
| `pokemon` | `Object \| null` | Datos completos del Pokémon. `null` mientras carga. |
| `isLoading` | `boolean` | `true` durante el primer fetch. |
| `isError` | `boolean` | `true` si falló (ej: nombre inválido → 404). |
| `error` | `Error \| null` | Objeto de error. |

---

## Capa de componentes

Componentes de UI puros y reutilizables. Reciben datos por props y no hacen fetching propio.

---

### `src/components/SearchBar.jsx`

**Responsabilidad:** renderizar el campo de texto para filtrar Pokémon. Es un componente completamente controlado: su estado vive en el padre (`HomePage`).

#### Props

| Prop | Tipo | Requerida | Descripción |
|---|---|---|---|
| `value` | `string` | Sí | Texto actual del campo. Controlado desde `HomePage`. |
| `onChange` | `function` | Sí | Handler que recibe el evento de cambio. Firma: `(event) => void` |

#### Componentes MUI utilizados

- `TextField`: campo de texto con soporte para `variant`, `placeholder`, estilos, etc.
- `InputAdornment`: contenedor para el ícono dentro del campo (posición `start`)
- `SearchIcon`: ícono de lupa de `@mui/icons-material`

#### Por qué es controlado

El filtrado ocurre en `HomePage`, no aquí. Si `SearchBar` manejara su propio estado, `HomePage` no podría leer el texto para filtrar la lista. Al ser controlado, `HomePage` tiene control total sobre el valor en todo momento.

---

### `src/components/PokemonCard.jsx`

**Responsabilidad:** mostrar la información visual básica de un Pokémon (imagen, número, nombre) y navegar al detalle al hacer clic.

#### Props

| Prop | Tipo | Requerida | Descripción |
|---|---|---|---|
| `name` | `string` | Sí | Nombre en minúsculas (ej: `"pikachu"`). Se usa para la URL de navegación y para capitalizar. |
| `id` | `number` | Sí | ID numérico de la Pokédex. Se usa para construir la URL de la imagen y formatear `#025`. |

#### Construcción de la URL de imagen

```js
const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
```

La PokeAPI aloja sus sprites en GitHub. La URL usa el ID numérico del Pokémon (no el nombre) para garantizar unicidad. Si esta imagen falla (el `onError`), cae al sprite normal:

```js
onError={(e) => {
  e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}}
```

#### Formateo del número

```js
const formattedId = `#${String(id).padStart(3, '0')}`
// id=1   → "#001"
// id=25  → "#025"
// id=150 → "#150"
```

#### Navegación

Usa `useNavigate` de React Router. Al hacer clic en `CardActionArea`, llama a:

```js
navigate(`/pokemon/${name}`)
// Ej: navigate("/pokemon/pikachu")
```

#### Componentes MUI utilizados

- `Card`: contenedor con sombra y bordes redondeados
- `CardActionArea`: hace que toda la tarjeta sea clickeable (accesibilidad incluida)
- `CardContent`: padding interno para el texto
- `Typography`: texto con variantes tipográficas (`caption`, `h6`)
- `Box`: contenedor flex para centrar la imagen

#### Efecto hover

```js
'&:hover': {
  transform: 'translateY(-4px)',
  boxShadow: 6,
}
```

La tarjeta sube 4px con una sombra más pronunciada al pasar el mouse, con transición suave de `0.2s`.

---

### `src/components/PokemonList.jsx`

**Responsabilidad:** renderizar la grilla de tarjetas. Recibe el array ya filtrado y lo mapea a `PokemonCard`.

#### Props

| Prop | Tipo | Requerida | Descripción |
|---|---|---|---|
| `pokemonList` | `Array<{name: string, url: string}>` | Sí | Array de Pokémon a mostrar (ya filtrado por búsqueda). |

#### Extracción del ID desde la URL

La API retorna URLs como `"https://pokeapi.co/api/v2/pokemon/25/"`. El ID está en el penúltimo segmento al dividir por `/`:

```js
const getIdFromUrl = (url) => {
  const parts = url.split('/')
  return parseInt(parts[parts.length - 2])
}
// "https://pokeapi.co/api/v2/pokemon/25/" → 25
```

#### Grilla responsiva con MUI Grid

```jsx
<Grid size={{ xs: 6, sm: 4, md: 3 }}>
```

| Breakpoint | Columnas por fila | Ancho de pantalla |
|---|---|---|
| `xs` (6/12) | 2 columnas | < 600px (móvil) |
| `sm` (4/12) | 3 columnas | 600px – 900px (tablet) |
| `md` (3/12) | 4 columnas | > 900px (desktop) |

#### Estado vacío

Si `pokemonList.length === 0` (búsqueda sin resultados), muestra un `Typography` informativo en lugar de una grilla vacía.

---

### `src/components/Pagination.jsx`

**Responsabilidad:** calcular el total de páginas y renderizar los controles de navegación. Notifica al padre cuando el usuario cambia de página.

#### Props

| Prop | Tipo | Requerida | Descripción |
|---|---|---|---|
| `currentPage` | `number` | Sí | Página activa actualmente. |
| `totalCount` | `number` | Sí | Total de Pokémon en la API (para calcular páginas totales). |
| `itemsPerPage` | `number` | No (default: `20`) | Pokémon por página. |
| `onPageChange` | `function` | Sí | Callback: `(newPage: number) => void` |

#### Cálculo de páginas totales

```js
const totalPages = Math.ceil(totalCount / itemsPerPage)
// 1302 / 20 = 65.1 → Math.ceil → 66 páginas
```

#### Firma del evento de MUI Pagination

MUI llama al `onChange` con `(event, value)`. Solo necesitamos `value` (el número de página):

```js
const handleChange = (_, newPage) => {
  onPageChange(newPage)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
```

El scroll suave hacia arriba mejora la experiencia al cambiar de página.

#### Componentes MUI utilizados

- `Pagination` (renombrado como `MuiPagination` para evitar conflicto con el nombre del componente)
- Props usadas: `count`, `page`, `onChange`, `color="primary"`, `showFirstButton`, `showLastButton`

---

## Capa de páginas

Las páginas son los únicos componentes que usan hooks de datos. Orquestan la lógica y pasan datos a los componentes mediante props.

---

### `src/pages/HomePage.jsx`

**Responsabilidad:** página principal. Gestiona el estado de búsqueda y paginación, y coordina todos los componentes de la vista lista.

#### Estado local

```js
const [searchTerm, setSearchTerm] = useState('')     // Texto de búsqueda
const [currentPage, setCurrentPage] = useState(1)    // Página activa
```

#### Datos del servidor

```js
const { pokemonList, totalCount, isLoading, isError, error } = usePokemonList(currentPage)
```

React Query hace el fetch automáticamente cuando `currentPage` cambia.

#### Filtrado local por búsqueda

```js
const filteredPokemon = pokemonList.filter((pokemon) =>
  pokemon.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
)
```

El filtrado es **local** (solo sobre los 20 resultados de la página actual) porque la PokeAPI no ofrece un endpoint de búsqueda por texto parcial. Para búsqueda global habría que cargar la lista completa primero.

#### Lógica de interacción

| Evento | Handler | Efecto |
|---|---|---|
| Usuario escribe en SearchBar | `handleSearchChange` | Actualiza `searchTerm` + reinicia `currentPage` a `1` |
| Usuario hace clic en un número de página | `handlePageChange` | Actualiza `currentPage` + limpia `searchTerm` |

Reiniciar la página al buscar evita un estado inconsistente (ej: estar en página 5 con un filtro que solo tiene 3 resultados).

#### Árbol de renderizado

```
HomePage
├── Typography (título "PokéDex Felipe")
├── Typography (subtítulo)
├── SearchBar (value={searchTerm}, onChange={handleSearchChange})
├── [si isLoading] CircularProgress
├── [si isError] Alert
└── [si datos]
    ├── PokemonList (pokemonList={filteredPokemon})
    └── [si !searchTerm] Pagination (currentPage, totalCount, onPageChange)
```

La paginación se oculta cuando hay una búsqueda activa, ya que el filtrado es sobre la página actual y los números de página perderían significado.

---

### `src/pages/PokemonDetailPage.jsx`

**Responsabilidad:** página de detalle. Obtiene el nombre del Pokémon de la URL, carga sus datos y los muestra en un layout de dos columnas.

#### Obtención del parámetro de URL

```js
const { name } = useParams()
// URL "/pokemon/pikachu" → name = "pikachu"
```

`useParams` es un hook de React Router que extrae los segmentos dinámicos de la URL (definidos como `:name` en `App.jsx`).

#### Color temático por tipo

```js
const TYPE_COLORS = {
  fire: '#FF9800',
  water: '#2196F3',
  grass: '#4CAF50',
  // ... 18 tipos en total
}

const primaryType = pokemon.types[0]?.type.name
const bgColor = TYPE_COLORS[primaryType] ?? '#BDBDBD'
```

El color de fondo de toda la página cambia según el tipo principal del Pokémon. Si el tipo no está en el diccionario, usa gris como fallback.

#### URL de la imagen con fallback en cadena

```js
const imageUrl =
  pokemon.sprites?.other?.['official-artwork']?.front_default ??
  pokemon.sprites?.front_default
```

Usa el [optional chaining (`?.`)](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Optional_chaining) para no lanzar error si algún nivel del objeto es `null`. Si el artwork oficial no existe, cae al sprite estándar.

#### Formateo de nombres de movimientos

```js
move.name
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ')
// "thunder-bolt" → "Thunder Bolt"
// "quick-attack" → "Quick Attack"
```

La API retorna los movimientos en formato kebab-case. Se convierten a Title Case para mejor legibilidad.

#### Layout de dos columnas

```
┌─────────────────────────────────────┐
│  [Botón volver]                     │
│                                     │
│  ┌──────────────────┐  ┌──────────┐ │
│  │ #025 Pikachu     │  │  [Img]   │ │
│  │ [Tipo: Electric] │  │  grande  │ │
│  │                  │  │          │ │
│  │ Movimientos (88) │  │          │ │
│  │ ─────────────    │  └──────────┘ │
│  │ Thunder          │               │
│  │ Quick Attack     │               │
│  │ ...              │               │
│  └──────────────────┘               │
└─────────────────────────────────────┘
```

En móvil (`xs`) ambas columnas ocupan el 100% del ancho y se apilan verticalmente.

#### Estados de renderizado

| Estado | Qué muestra |
|---|---|
| `isLoading = true` | `CircularProgress` centrado en pantalla completa |
| `isError = true` | `Alert` con el mensaje de error + botón de volver |
| Datos disponibles | Layout completo con imagen, tipos y movimientos |

---

## Punto de entrada y configuración global

### `src/main.jsx`

Es el archivo raíz que React monta en el DOM. Configura los dos proveedores globales que toda la app necesita.

#### QueryClient

```js
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
})
```

| Opción | Valor | Efecto |
|---|---|---|
| `staleTime` | 300,000 ms (5 min) | Los datos se consideran "frescos" 5 minutos. No hace refetch al re-montar un componente si los datos son recientes. |
| `retry` | `1` | Si una petición falla, lo reintenta 1 vez antes de marcar `isError = true`. |

#### Árbol de proveedores

```jsx
<QueryClientProvider client={queryClient}>   ← React Query disponible en toda la app
  <BrowserRouter>                            ← React Router disponible en toda la app
    <App />                                  ← Árbol de componentes
  </BrowserRouter>
</QueryClientProvider>
```

El orden importa: `QueryClientProvider` envuelve a `BrowserRouter` porque ambos son independientes, pero si algún hook de datos necesitara acceder al router, debe estar dentro de `BrowserRouter`.

### `src/App.jsx`

Define el mapa de rutas de la aplicación:

```jsx
<Routes>
  <Route path="/"              element={<HomePage />} />
  <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
</Routes>
```

`:name` es un **parámetro dinámico de URL**. React Router lo extrae y lo expone via `useParams()` en `PokemonDetailPage`.

---

## Flujo de datos completo

### Flujo: cargar la lista de Pokémon

```
Usuario abre "/"
    ↓
App.jsx renderiza <HomePage />
    ↓
HomePage llama a usePokemonList(page=1)
    ↓
usePokemonList construye queryKey ['pokemonList', 1, 20]
    ↓
React Query: ¿está en caché? NO → ejecuta queryFn
    ↓
getPokemonList(limit=20, offset=0)
    ↓
fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0")
    ↓
Response JSON → { count: 1302, results: [...20 pokémon] }
    ↓
React Query: isLoading=false, data disponible
    ↓
HomePage filtra por searchTerm (vacío → muestra los 20)
    ↓
<PokemonList pokemonList={filteredPokemon} />
    ↓
20 × <PokemonCard name="..." id={...} />
```

### Flujo: buscar un Pokémon

```
Usuario escribe "char" en SearchBar
    ↓
handleSearchChange → setSearchTerm("char"), setCurrentPage(1)
    ↓
React re-renderiza HomePage
    ↓
filteredPokemon = pokemonList.filter(p => p.name.includes("char"))
  → ["charmander", "charmeleon", "charizard"] (si están en la página actual)
    ↓
PokemonList renderiza solo esos 3
    ↓
Pagination se oculta (searchTerm no está vacío)
```

### Flujo: ver el detalle de un Pokémon

```
Usuario hace clic en la tarjeta de "Pikachu"
    ↓
PokemonCard llama a navigate("/pokemon/pikachu")
    ↓
React Router renderiza <PokemonDetailPage />
    ↓
useParams() → { name: "pikachu" }
    ↓
usePokemonDetail("pikachu")
    ↓
queryKey: ['pokemonDetail', 'pikachu']
React Query: ¿en caché? NO → fetch
    ↓
getPokemonDetail("pikachu")
    ↓
fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
    ↓
Response JSON → { id: 25, name: "pikachu", sprites: {...}, moves: [...], types: [...] }
    ↓
PokemonDetailPage renderiza: imagen + tipos + lista de movimientos
```

---

## Despliegue en GitHub Pages

### 1. Instalar gh-pages

```bash
npm install --save-dev gh-pages
```

### 2. Configurar `vite.config.js`

Agregar `base` con el nombre exacto del repositorio en GitHub:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/pokedex-felipe/',  // ← nombre del repositorio en GitHub
})
```

Sin esta configuración, los assets (JS, CSS, imágenes) no cargarán en GitHub Pages porque la app estará en `https://usuario.github.io/pokedex-felipe/` y no en la raíz `/`.

### 3. Agregar scripts en `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

- `predeploy`: npm lo ejecuta automáticamente antes de `deploy`. Compila la app.
- `deploy`: sube el contenido de `/dist` a la rama `gh-pages` del repositorio.

### 4. Inicializar Git y subir a GitHub

```bash
# Inicializar repositorio local
git init
git add .
git commit -m "feat: PokéDex Felipe inicial"

# Conectar con repositorio remoto en GitHub (crearlo primero en github.com)
git remote add origin https://github.com/tu-usuario/pokedex-felipe.git
git branch -M main
git push -u origin main
```

### 5. Desplegar

```bash
npm run deploy
```

Esto ejecuta `predeploy` (build) y luego sube `/dist` a la rama `gh-pages`.

### 6. Configurar GitHub Pages

En GitHub → Settings → Pages → Source: seleccionar rama `gh-pages`, carpeta `/ (root)` → Save.

La app quedará disponible en:
```
https://tu-usuario.github.io/pokedex-felipe/
```

### Re-despliegues futuros

Cada vez que hagas cambios:

```bash
git add .
git commit -m "descripción del cambio"
git push
npm run deploy
```

---

## Notas técnicas adicionales

### Por qué React Query en lugar de `useEffect` + `useState`

Con `useEffect`:
```js
// Hay que manejar manualmente: loading, error, datos, cleanup, deduplicación...
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  setLoading(true)
  fetch(url)
    .then(r => r.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false))
}, [url])
```

Con React Query:
```js
// Todo lo anterior en una línea, más caché automático
const { data, isLoading, isError, error } = useQuery({ queryKey, queryFn })
```

React Query además agrega: caché global, deduplicación de peticiones idénticas, revalidación al volver a enfocar la ventana, y reintentos automáticos.

### Por qué el filtrado de búsqueda es local

La PokeAPI tiene endpoints como `/pokemon?limit=20&offset=0` pero no tiene `/pokemon?search=char`. Para buscar en todos los Pokémon habría que hacer primero `GET /pokemon?limit=100000` (cargar todo), guardarlo en estado y filtrar localmente. La implementación actual filtra solo los 20 de la página visible, lo cual es correcto para el alcance del proyecto.
