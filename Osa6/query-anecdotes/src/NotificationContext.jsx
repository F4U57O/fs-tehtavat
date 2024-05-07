import { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

const initialState = {
    message: null
}

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
          return { message: action.payload }
        case 'CLEAR_NOTIFICATION':
          return {message: null }
        default:
          return state

    }
}

export const NotificationContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(notificationReducer, initialState)

    const showNotification = (message) => {
        dispatch({ type: 'SET_NOTIFICATION', payload: message})
        setTimeout(() => {
          dispatch({ type: 'CLEAR_NOTIFICATION'})
        }, 5000)
    }

    return (
        <NotificationContext.Provider value={{state, showNotification}}>
          {children}
        </NotificationContext.Provider>
    )
}
    export const useNotification = () => {
        const context = useContext(NotificationContext)
        return context
    }
export default NotificationContext