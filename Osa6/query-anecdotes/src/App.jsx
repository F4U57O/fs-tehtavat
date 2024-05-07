import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotification } from './NotificationContext'


const App = () => {
  const { showNotification } = useNotification()
  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes']})
    }
  })

  const addAnecdote = (content) => {
    if (content.length < 5) {
      showNotification('too short anecdote, must have length 5 or more')
    } else {
    newAnecdoteMutation.mutate({ content, votes: 0})
    showNotification(`anecdote '${content}' added`)
    }
  }

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    showNotification(`anecdote '${anecdote.content}' voted`)
    console.log('vote')
  }

  const result = useQuery({    
    queryKey: ['anecdotes'],    
    queryFn: getAnecdotes 
  })  
  console.log(JSON.parse(JSON.stringify(result)))
  
  if ( result.isLoading ) {    
    return <div>loading data...</div>  
  }

  if ( result.isError && result.fetchStatus === 'idle') {
    return <span>anecdote service not available due to problems in server</span>
  }

  const anecdotes = result.data

  return (
    
    <div>
      <h3>Anecdote app</h3>
    
      <Notification/>
      <AnecdoteForm onCreateAnecdote={addAnecdote}/>
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
    
  )
}

export default App
