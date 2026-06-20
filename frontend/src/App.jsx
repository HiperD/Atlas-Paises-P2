import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  useMediaQuery,
} from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AddIcon from '@mui/icons-material/Add'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
})

function sortCountries(list, sortBy) {
  const cloned = [...list]

  if (sortBy === 'population-desc') {
    return cloned.sort((a, b) => b.population - a.population)
  }

  if (sortBy === 'population-asc') {
    return cloned.sort((a, b) => a.population - b.population)
  }

  if (sortBy === 'area-desc') {
    return cloned.sort((a, b) => b.area - a.area)
  }

  if (sortBy === 'area-asc') {
    return cloned.sort((a, b) => a.area - b.area)
  }

  return cloned.sort((a, b) => a.name.localeCompare(b.name))
}

function mapCountry(row) {
  return {
    id: row.id,
    name: row.name,
    cca3: row.cca3,
    capital: row.capital || 'Nao informado',
    region: row.region,
    population: Number(row.population || 0),
    area: Number(row.area || 0),
    flagUrl: row.flag_url || 'https://flagcdn.com/w320/un.png',
    insertedAt: row.inserted_at,
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0a6e6e',
    },
    secondary: {
      main: '#f2722c',
    },
    background: {
      default: '#f3f6f9',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Poppins, Segoe UI, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
  },
})

function App() {
  const [countries, setCountries] = useState([])
  const [visibleCountries, setVisibleCountries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [region, setRegion] = useState('all')
  const [sortBy, setSortBy] = useState('name-asc')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favoriteCountries') || '[]'))
  const [token, setToken] = useState(localStorage.getItem('authToken') || '')
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser') || 'null'))
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [insertDialogOpen, setInsertDialogOpen] = useState(false)
  const [insertForm, setInsertForm] = useState({
    name: '',
    cca3: '',
    capital: '',
    region: 'Americas',
    population: '',
    area: '',
    flagUrl: '',
  })
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  async function fetchCountries() {
    if (!token) {
      setCountries([])
      setVisibleCountries([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await api.get('/countries', {
        params: {
          search: searchTerm,
          region,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const parsedCountries = (response.data.countries || []).map(mapCountry)
      const sorted = sortCountries(parsedCountries, sortBy)
      setCountries(parsedCountries)
      setVisibleCountries(sorted)
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        logout('Sessao expirada. Faca login novamente.')
        return
      }

      setError('Nao foi possivel carregar os paises. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function logout(message) {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setToken('')
    setUser(null)
    setCountries([])
    setVisibleCountries([])
    setSuccess(message || null)
  }

  async function handleLogin(event) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const response = await api.post('/auth/login', loginForm)
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('authUser', JSON.stringify(response.data.user))
      setToken(response.data.token)
      setUser(response.data.user)
      setLoginForm({ username: '', password: '' })
      setSuccess('Login realizado com sucesso.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Falha no login.')
    }
  }

  async function handleInsertCountry(event) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      await api.post(
        '/countries',
        {
          ...insertForm,
          cca3: insertForm.cca3.toUpperCase(),
          population: Number(insertForm.population),
          area: Number(insertForm.area),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setInsertDialogOpen(false)
      setInsertForm({
        name: '',
        cca3: '',
        capital: '',
        region: 'Americas',
        population: '',
        area: '',
        flagUrl: '',
      })
      setSuccess('Pais inserido com sucesso.')
      await fetchCountries()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Erro ao inserir pais.')
    }
  }

  useEffect(() => {
    fetchCountries()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, searchTerm, region, sortBy])

  useEffect(() => {
    localStorage.setItem('favoriteCountries', JSON.stringify(favorites))
  }, [favorites])

  const favoriteCount = visibleCountries.filter((country) => favorites.includes(country.cca3)).length

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background:
            'radial-gradient(circle at 12% 18%, rgba(10, 110, 110, 0.18), transparent 36%), radial-gradient(circle at 85% 0%, rgba(242, 114, 44, 0.24), transparent 28%), #f3f6f9',
          pb: 5,
        }}
      >
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', color: 'text.primary' }}>
          <Toolbar sx={{ py: 2 }}>
            <PublicIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Atlas Interativo de Paises
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl">
          {!token && (
            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }} component="form" onSubmit={handleLogin}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Login
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                Para buscar e inserir paises, voce precisa estar autenticado.
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    fullWidth
                    required
                    label="Usuario"
                    value={loginForm.username}
                    onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    fullWidth
                    required
                    type="password"
                    label="Senha"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Button fullWidth type="submit" variant="contained" sx={{ height: '100%' }}>
                    Entrar
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}

          {token && (
          <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Explore paises, regioes e dados globais
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 3 }}>
              Projeto SPA em React com API propria em Express e PostgreSQL.
            </Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 5 }}>
                <TextField
                  fullWidth
                  label="Buscar pais"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="region-label">Regiao</InputLabel>
                  <Select
                    labelId="region-label"
                    label="Regiao"
                    value={region}
                    onChange={(event) => setRegion(event.target.value)}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="Africa">Africa</MenuItem>
                    <MenuItem value="Americas">Americas</MenuItem>
                    <MenuItem value="Asia">Asia</MenuItem>
                    <MenuItem value="Europe">Europe</MenuItem>
                    <MenuItem value="Oceania">Oceania</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="sort-label">Ordenar</InputLabel>
                  <Select
                    labelId="sort-label"
                    label="Ordenar"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <MenuItem value="name-asc">Nome (A-Z)</MenuItem>
                    <MenuItem value="population-desc">Populacao (maior)</MenuItem>
                    <MenuItem value="population-asc">Populacao (menor)</MenuItem>
                    <MenuItem value="area-desc">Extensao territorial (maior)</MenuItem>
                    <MenuItem value="area-asc">Extensao territorial (menor)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 1 }}>
                <Button fullWidth variant="contained" color="secondary" onClick={() => {
                  setSearchTerm('')
                  setRegion('all')
                  setSortBy('name-asc')
                }}>
                  Limpar
                </Button>
              </Grid>
            </Grid>

            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setInsertDialogOpen(true)}
              >
                Inserir Pais
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => logout('Logout realizado com sucesso.')}
              >
                Sair ({user?.username || 'usuario'})
              </Button>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}>
              <Chip label={`${visibleCountries.length} paises visiveis`} color="primary" variant="outlined" />
              <Chip label={`${favoriteCount} favoritos na tela`} color="secondary" variant="outlined" />
            </Stack>
          </Paper>
          )}

          {loading && <LinearProgress sx={{ mb: 2 }} />}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {token && !loading && !error && (
            <Grid container spacing={2.5}>
              {visibleCountries.map((country) => {
                const isFavorite = favorites.includes(country.cca3)
                return (
                  <Grid key={country.cca3} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="img"
                        height="160"
                        image={country.flagUrl}
                        alt={`Bandeira de ${country.name}`}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="h6" sx={{ fontSize: '1.05rem' }}>
                            {country.name}
                          </Typography>
                          <IconButton
                            color={isFavorite ? 'secondary' : 'default'}
                            onClick={() => {
                              setFavorites((current) => {
                                if (current.includes(country.cca3)) {
                                  return current.filter((id) => id !== country.cca3)
                                }
                                return [...current, country.cca3]
                              })
                            }}
                            aria-label="favoritar pais"
                          >
                            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                          </IconButton>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Capital: {country.capital}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Regiao: {country.region}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Populacao: {country.population.toLocaleString('pt-BR')}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setSelectedCountry(country)}
                        >
                          Ver detalhes
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          )}

          {token && !loading && !error && visibleCountries.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Nenhum pais encontrado com os filtros atuais.
            </Alert>
          )}
        </Container>

        <Dialog
          open={Boolean(selectedCountry)}
          onClose={() => setSelectedCountry(null)}
          fullWidth
          maxWidth="sm"
          fullScreen={fullScreen}
        >
          <DialogTitle>
            {selectedCountry?.name || 'Detalhes do pais'}
          </DialogTitle>
          <DialogContent dividers>
            {selectedCountry && (
              <Stack spacing={1.2}>
                <Typography>
                  <strong>Codigo:</strong> {selectedCountry.cca3}
                </Typography>
                <Typography>
                  <strong>Capital:</strong> {selectedCountry.capital}
                </Typography>
                <Typography>
                  <strong>Regiao:</strong> {selectedCountry.region}
                </Typography>
                <Typography>
                  <strong>Area:</strong> {selectedCountry.area.toLocaleString('pt-BR')} km2
                </Typography>
                <Typography>
                  <strong>Populacao:</strong> {selectedCountry.population.toLocaleString('pt-BR')}
                </Typography>
                <Typography>
                  <strong>Inserido em:</strong>{' '}
                  {selectedCountry.insertedAt
                    ? new Date(selectedCountry.insertedAt).toLocaleString('pt-BR')
                    : 'Nao informado'}
                </Typography>
              </Stack>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={insertDialogOpen}
          onClose={() => setInsertDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Inserir Novo Pais</DialogTitle>
          <DialogContent dividers>
            <Box component="form" onSubmit={handleInsertCountry} sx={{ pt: 1 }}>
              <Stack spacing={2}>
                <TextField
                  required
                  label="Nome"
                  value={insertForm.name}
                  onChange={(event) => setInsertForm((current) => ({ ...current, name: event.target.value }))}
                />
                <TextField
                  required
                  label="Codigo CCA3"
                  value={insertForm.cca3}
                  inputProps={{ maxLength: 3 }}
                  onChange={(event) => setInsertForm((current) => ({ ...current, cca3: event.target.value }))}
                />
                <TextField
                  label="Capital"
                  value={insertForm.capital}
                  onChange={(event) => setInsertForm((current) => ({ ...current, capital: event.target.value }))}
                />
                <FormControl fullWidth>
                  <InputLabel id="insert-region-label">Regiao</InputLabel>
                  <Select
                    labelId="insert-region-label"
                    label="Regiao"
                    value={insertForm.region}
                    onChange={(event) => setInsertForm((current) => ({ ...current, region: event.target.value }))}
                  >
                    <MenuItem value="Africa">Africa</MenuItem>
                    <MenuItem value="Americas">Americas</MenuItem>
                    <MenuItem value="Asia">Asia</MenuItem>
                    <MenuItem value="Europe">Europe</MenuItem>
                    <MenuItem value="Oceania">Oceania</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  required
                  type="number"
                  label="Populacao"
                  value={insertForm.population}
                  onChange={(event) => setInsertForm((current) => ({ ...current, population: event.target.value }))}
                />
                <TextField
                  required
                  type="number"
                  label="Area (km2)"
                  value={insertForm.area}
                  onChange={(event) => setInsertForm((current) => ({ ...current, area: event.target.value }))}
                />
                <TextField
                  required
                  label="URL da Bandeira"
                  value={insertForm.flagUrl}
                  onChange={(event) => setInsertForm((current) => ({ ...current, flagUrl: event.target.value }))}
                />
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => setInsertDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit" variant="contained">Salvar</Button>
                </Stack>
              </Stack>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}

export default App
