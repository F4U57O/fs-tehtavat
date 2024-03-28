import { useState, useEffect } from 'react'
import axios from 'axios'

const FilterCountries = ({ countries, filter, handleShowCountry }) => {
  const filterCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  if (filterCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  return (
    <ul>
    {filterCountries.map(country => (
      <li key={country.cca2}>{country.name.common}
      <button onClick={() => handleShowCountry(country)}>show</button></li>
    ))}
  </ul>
  )
}

const CountryDetails = ({ country }) => {
  if (!country) {
    return null
  }

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital}</p>
      <p>area {country.population}</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [oneCountry, setOneCountry] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        setCountries(response.data)
      } catch (error) {
        console.error('Error fetching countries', error)
      }
    }
    fetchData()
  }, [])

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const handleShowCountry = (country) => {
    setOneCountry(country)
  }

  useEffect(() => {
    if (filter === '') {
      setOneCountry(null)
      return
    }

  const filterCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

    if (filterCountries.length === 1) {
      setOneCountry(filterCountries[0])
    } else {
      setOneCountry(null)
    }
  }, [filter, countries])



  return (
    <div>
      <form>
        find countries <input type="text" value={filter} onChange={handleFilter} />
      </form>
      {filter !== '' && <FilterCountries countries={countries} filter={filter} handleShowCountry={handleShowCountry}/>}
      <CountryDetails country={oneCountry} />
    </div>
  )
}

export default App
