import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
import { setNotification, clearNotification } from './notificationReducer'


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    setVotes(state, action) {
      const { id, votes } = action.payload
      const anecdoteToUpdate = state.find(anecdote => anecdote.id === id)
      if (anecdoteToUpdate) {
        anecdoteToUpdate.votes = votes
      }
    }
  }
})

export const { appendAnecdote, setAnecdotes, setVotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
    
  }
}

export const voteAction = (id) => {
  return async (dispatch, getState) => {
    const { anecdotes } = getState()
    const updatedAnecdote = anecdotes.find(anecdote => anecdote.id === id)

    if (updatedAnecdote) {
      const votedAnecdote = { ...updatedAnecdote, votes: updatedAnecdote.votes + 1 }
      await anecdoteService.update(votedAnecdote)
      dispatch(setVotes({ id: votedAnecdote.id, votes: votedAnecdote.votes }))
      dispatch(setNotification(`ỳou voted "${votedAnecdote.content}"`, 5))
    }
  }
}

export const showNotification = (message, time) => {
  return dispatch => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, time * 1000)
  }
}

export default anecdoteSlice.reducer

