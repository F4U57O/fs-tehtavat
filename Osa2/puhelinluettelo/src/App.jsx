import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'


const Filter = ({ filter, handleFilter }) => {
  return (
    <div>filter shown with <input value={filter}
    onChange={handleFilter} /></div>
  )
}

const PersonForm = ({ addPerson, newName, newNumber, handlePersonAdd, handleNumberAdd}) => {
  return (
    <form onSubmit={addPerson}>
    <div>
      name: <input value={newName}
      onChange={handlePersonAdd}
      />
    </div>
    <div>
      number: <input value={newNumber}
      onChange={handleNumberAdd}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const Persons = ({ persons, onDelete }) => {
  return (
    <ul>
    {persons.map(person => (
      <div key={person.id}>{person.name} {person.number}
      <button onClick={() => onDelete(person)}>Delete</button>
      </div>
      ))}
  </ul>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
  }

  const Error = ({ message }) => {
    if (message === null) {
      return null
    }
    const errorStyle = {
      color: 'red',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }
    return (
      <div style={errorStyle}>
        {message}
      </div>
    )
    }


const App = (props) => {
  const [persons, setPersons] = useState([
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const sameName =persons.find(person => person.name === newName)
    
    sameName
      ? window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
        ? axios
          .put(`http://localhost:3001/persons/${sameName.id}`, {...sameName, number: newNumber })
          .then(response => {
            setPersons(persons.map(person => person.id !== sameName.id ? person : response.data))
            setNewName('')
            setNewNumber('')
            setNotificationMessage(          
              `Updated ${newName} new number: ${newNumber}`        
              )        
              setTimeout(() => {          
                setNotificationMessage(null)        
              }, 5000)
        })
        .catch(error => {
          setErrorMessage(
            `Information of ${newName} has already been removed from server`
          )
          setTimeout(() => {          
            setErrorMessage(null)        
          }, 5000)
          setPersons(persons.filter(p => p.id !== sameName.id))
          console.error('Updating failed', error)
        })
        : null
      :  axios
        .post('http://localhost:3001/persons', { name: newName, number: newNumber})
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName(''), setNewNumber('')
          setNotificationMessage(          
            `Added ${newName}`        
            )        
            setTimeout(() => {          
              setNotificationMessage(null)        
            }, 5000)
          console.log(response)
    })}

  const deletePerson = (person) => {
    person
    ? window.confirm(`Delete ${person.name}?`)
    ? axios
      .delete(`http://localhost:3001/persons/${person.id}`)
      .then(response => {
        console.log('Delete succesful')
        setPersons(persons.filter(p => p.id !== person.id))
        setNotificationMessage(          
          `Deleted ${person.name}`        
          )        
          setTimeout(() => {          
            setNotificationMessage(null)        
          }, 5000)
      })
      .catch(error => {
        console.error('Delete failed')
      })
      : null
    : null
  }

  const handlePersonAdd = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberAdd =(event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilter =(event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }
  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div >
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h2>add a new</h2>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        newNumber={newNumber} 
        handlePersonAdd={handlePersonAdd} 
        handleNumberAdd={handleNumberAdd} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )

}

export default App