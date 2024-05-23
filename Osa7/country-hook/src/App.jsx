import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        console.log('Response: ', response.data)
        if (response.data.name.common) {
          setCountry({ data: response.data, found: true })
        } else {
          setCountry({ found: false })
        }
      } catch (error) {
        console.error('Error finding country:', error)
        setCountry({ found: false })
      }
    }
    if (name.trim() !== '') {
      fetchCountry()
    }
  }, [name])
  console.log('Name:', name)
  console.log('Country:', country)
  return country
}

const Country = ({ country }) => {
  console.log('Country component received:', country)
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name.common} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flags.png} height='100' alt={`flag of ${country.data.name.common}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App