import { useDispatch, useSelector } from 'react-redux'
import { voteAction } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'



const AnecdoteList = () => {
    const anecdotes = useSelector(({ filter, anecdotes }) => {
      if ( filter === 'ALL') {
        return anecdotes
      }
      return anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    })

    const sortedAnecdotes = [...anecdotes].sort((a,b) => b.votes - a.votes)

    const dispatch = useDispatch()

  const vote = (id) => {
    const votedAnecdote = anecdotes.find(anecdote => anecdote.id === id)
    dispatch(voteAction(id))
    dispatch(setNotification(`you voted "${votedAnecdote.content}"`))
    console.log('content:', votedAnecdote.content)
    console.log('vote', id)
    }

  return (
    <div>
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}

    </div>
  )
}

export default AnecdoteList