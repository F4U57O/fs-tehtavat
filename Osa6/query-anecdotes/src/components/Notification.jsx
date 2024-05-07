import { useEffect } from 'react'
import { useNotification } from '../NotificationContext'

const Notification = () => {
  const { state, dispatch } = useNotification()
  console.log(state)

  useEffect(() => {
    if (state.message) {
      const timeout = setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [state.message, dispatch])

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    display: state.message ? 'block' : 'none'
  }

  return (
    <div style={style}>
      {state.message}
    </div>
  )
}

export default Notification
