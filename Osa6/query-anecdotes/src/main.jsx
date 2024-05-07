import ReactDOM from 'react-dom/client'
import { NotificationContextProvider } from './NotificationContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'


const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
  <QueryClientProvider client={queryClient}>
    <App />

  </QueryClientProvider>
  </NotificationContextProvider>
)