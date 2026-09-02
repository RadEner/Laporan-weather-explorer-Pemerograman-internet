import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  // Debounce: tunggu user berhenti mengetik selama 600ms sebelum trigger fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim())
    }, 600)
    return () => clearTimeout(timer)
  }, [search])

  // useEffect utama: dipicu setiap kali `query` berubah
  useEffect(() => {
    if (!query) {
      setData(null)
      setError(null)
      return
    }

    const controller = new AbortController()

    async function fetchWeather() {
      setLoading(true)
      setError(null)
      setData(null)

      try {
        // 1. Geocoding: cari koordinat kota
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            query
          )}&count=1&language=id&format=json`,
          { signal: controller.signal }
        )
        if (!geoRes.ok) throw new Error('Gagal menghubungi layanan geocoding')
        const geoData = await geoRes.json()

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error(`Kota "${query}" tidak ditemukan`)
        }

        const { latitude, longitude, name, country, admin1 } = geoData.results[0]

        // 2. Ambil data cuaca berdasarkan koordinat
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`,
          { signal: controller.signal }
        )
        if (!weatherRes.ok) throw new Error('Gagal mengambil data cuaca')
        const weatherData = await weatherRes.json()

        setData({
          name,
          country,
          admin1,
          current: weatherData.current,
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Terjadi kesalahan tak terduga')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()

    return () => controller.abort()
  }, [query])

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>🌤️ Weather Explorer</h1>
          <p className="subtitle">Cari cuaca kota mana pun secara live</p>
        </header>

        <input
          type="text"
          className="search-input"
          placeholder="Ketik nama kota... (misal: Denpasar, Tokyo, Paris)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="result-area">
          {loading && (
            <div className="state-card loading-state">
              <div className="spinner" />
              <p>Memuat data cuaca...</p>
            </div>
          )}

          {!loading && error && (
            <div className="state-card error-state">
              <p>⚠️ {error}</p>
            </div>
          )}

          {!loading && !error && data && (
            <div className="state-card data-card">
              <h2>
                {data.name}
                {data.admin1 ? `, ${data.admin1}` : ''}
              </h2>
              <p className="country">{data.country}</p>

              <div className="temp-display">
                {Math.round(data.current.temperature_2m)}°C
              </div>
              <p className="feels-like">
                Terasa seperti {Math.round(data.current.apparent_temperature)}°C
              </p>

              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Kelembapan</span>
                  <span className="detail-value">
                    {data.current.relative_humidity_2m}%
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Kecepatan Angin</span>
                  <span className="detail-value">
                    {data.current.wind_speed_10m} km/j
                  </span>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && !data && (
            <div className="state-card empty-state">
              <p>👆 Mulai ketik nama kota untuk melihat cuacanya</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
