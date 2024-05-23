import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearNotification } from '../reducers/notificationReducer'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  const dispatch = useDispatch()

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
    return () => clearTimeout(timeout)
  }, [notification, dispatch])

  console.log('Notification:', notification)
  return (
    notification && (
      <Alert
        variant="success"
        onClose={() => dispatch(clearNotification())}
        dismissible
      >
        {notification}
      </Alert>
    )
  )
}
export default Notification
